'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Notification } from '@/types'
import { useRouter } from 'next/navigation'

export function useNotifications() {
  const Router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useSupabaseClient()

  const getSongIdFromCommentId = useCallback(async (commentId: string): Promise<string | null> => {
    if (!commentId) return null;
    console.log('Fetching song ID for comment ID:', commentId)
    const { data } = await supabase
      .from('comments')
      .select('song_id')
      .eq('id', commentId)
      .single()
    console.log('Fetched song ID:', data?.song_id)
    if (data?.song_id) {
      return data.song_id
    }
    else {
      const { data: ParentComment } = await supabase
        .from('comments')
        .select('parent_id')
        .eq('id', commentId)
        .single()

      if (ParentComment?.parent_id) {
        return getSongIdFromCommentId(ParentComment.parent_id)
      }
    }
    return null
  }, [supabase])

  // Calculate unread count from notifications array
  const calculateUnreadCount = useCallback((notificationsList: Notification[]) => {
    const count = notificationsList.filter(n => !n.read).length
    setUnreadCount(count)
    return count
  }, [])

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      // The route returns array directly
      const notificationsList = Array.isArray(data) ? data : []
      setNotifications(notificationsList)
      
      // Calculate unread count from loaded notifications
      calculateUnreadCount(notificationsList)
      
      console.log('Loaded notifications:', data)
      console.log('Unread count:', notificationsList.filter(n => !n.read).length)
    } catch (err) {
      console.error('Error loading notifications:', err)
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [calculateUnreadCount])

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      })

      // Use functional update to avoid stale closure
      setNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.map(n =>
          notificationIds.includes(n.id)
            ? { ...n, read: true }
            : n
        )
        calculateUnreadCount(updatedNotifications)
        return updatedNotifications
      })
    } catch (err) {
      console.error('Error marking notifications as read:', err)
      setError('Failed to mark notifications as read')
    }
  }, [calculateUnreadCount])

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      // Use functional update to avoid stale closure
      setNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.map(n => ({ ...n, read: true }))
        setUnreadCount(0)
        return updatedNotifications
      })
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      setError('Failed to mark all notifications as read')
    }
  }, [])

  const deleteNotificationById = useCallback(async (notificationId: string) => {
    try {
      await fetch('/api/notifications/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })

      // Use functional update to avoid stale closure
      setNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.filter(n => n.id !== notificationId)
        calculateUnreadCount(updatedNotifications)
        return updatedNotifications
      })
    } catch (err) {
      console.error('Error deleting notification:', err)
      setError('Failed to delete notification')
    }
  }, [calculateUnreadCount])

  const navigateToNotification = useCallback(async (notification: Notification) => {
    switch (notification.type) {
      case 'user_follow':
      case 'song_like':
        Router.push(`/profiles/${notification.actor_id}`)
        break
      case 'song_comment':
        Router.push(`/threads/${notification.entity_id}`)
        break
      case 'comment_reply':
      case 'comment_vote':
        const commentIdAsString = notification.entity_id.toString()
        console.log('Navigating to comment ID to string:', commentIdAsString)
        const songId = await getSongIdFromCommentId(commentIdAsString)
        console.log('Navigating to song ID:', songId)
        Router.push(`/threads/${songId}`)
        break
      default:
        console.warn('Unknown notification type:', notification.type)
    }
  }, [Router, getSongIdFromCommentId])

  // Fixed useEffect for real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('New notification:', payload)
          // Reload notifications to get the complete data with joins
          loadNotifications()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('Notification updated:', payload)
          // Use functional update to avoid stale closure
          setNotifications(prevNotifications => {
            const updatedNotifications = prevNotifications.map(n =>
              n.id === payload.new.id
                ? { ...n, ...payload.new as Partial<Notification> }
                : n
            )
            calculateUnreadCount(updatedNotifications)
            return updatedNotifications
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, loadNotifications, calculateUnreadCount]) // Removed 'notifications' dependency

  // Load notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotificationById,
    navigateToNotification,
    refresh: () => {
      loadNotifications()
    }
  }
}