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

      const updatedNotifications = notifications.map(n =>
        notificationIds.includes(n.id)
          ? { ...n, read: true }
          : n
      )
      
      setNotifications(updatedNotifications)
      calculateUnreadCount(updatedNotifications)
    } catch (err) {
      console.error('Error marking notifications as read:', err)
      setError('Failed to mark notifications as read')
    }
  }, [notifications, calculateUnreadCount])

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
      setNotifications(updatedNotifications)
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      setError('Failed to mark all notifications as read')
    }
  }, [notifications])

  const deleteNotificationById = useCallback(async (notificationId: string) => {
    try {
      await fetch('/api/notifications/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })

      const updatedNotifications = notifications.filter(n => n.id !== notificationId)
      setNotifications(updatedNotifications)
      calculateUnreadCount(updatedNotifications)
    } catch (err) {
      console.error('Error deleting notification:', err)
      setError('Failed to delete notification')
    }
  }, [notifications, calculateUnreadCount])

  const navigateToNotification = useCallback((notification: Notification) => {
    switch (notification.type) {
      case 'song_like':
        Router.push(`/profiles/${notification.actor.id}`)
        break
      case 'song_comment':
      case 'comment_reply':
      case 'comment_vote':
        Router.push(`/threads/${notification.song?.id}`)
        break
      default:
        console.warn('Unknown notification type:', notification.type)
    }
  }, [])

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
          const updatedNotifications = notifications.map(n =>
            n.id === payload.new.id
              ? { ...n, ...payload.new as Partial<Notification> }
              : n
          )
          setNotifications(updatedNotifications)
          calculateUnreadCount(updatedNotifications)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, loadNotifications, notifications, calculateUnreadCount])

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

