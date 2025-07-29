'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Notification } from '@/types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = useSupabaseClient()

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      // The route returns array directly
      setNotifications(Array.isArray(data) ? data : [])
      console.log('Loaded notifications:', data)
      console.log('Current notifications state:', notifications)
    } catch (err) {
      console.error('Error loading notifications:', err)
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadUnreadCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/unread-count')
      const data = await res.json()
      setUnreadCount(data.count ?? 0)
    } catch (err) {
      console.error('Error loading unread count:', err)
    }
  }, [])

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      })

      setNotifications(prev =>
        prev.map(n =>
          notificationIds.includes(n.id)
            ? { ...n, read: true }
            : n
        )
      )

      setUnreadCount(prev => {
        const unreadMarked = notifications.filter(
          n => notificationIds.includes(n.id) && !n.read
        ).length
        return Math.max(0, prev - unreadMarked)
      })
    } catch (err) {
      console.error('Error marking notifications as read:', err)
      setError('Failed to mark notifications as read')
    }
  }, [notifications])

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
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

      setNotifications(prev => prev.filter(n => n.id !== notificationId))

      setUnreadCount(prev => {
        const deletedUnread = notifications.find(
          n => n.id === notificationId && !n.read
        )
        return deletedUnread ? Math.max(0, prev - 1) : prev
      })
    } catch (err) {
      console.error('Error deleting notification:', err)
      setError('Failed to delete notification')
    }
  }, [notifications])

  const navigateToNotification = useCallback((notification: Notification) => {
    switch (notification.type) {
      case 'song_like':
      case 'song_comment':
        window.location.href = `/songs/${notification.entity_id}`
        break
      case 'comment_reply':
      case 'comment_vote':
        window.location.href = `/songs/${notification.song?.id}#comment-${notification.entity_id}`
        break
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
          setUnreadCount(prev => prev + 1)
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
          setNotifications(prev =>
            prev.map(n =>
              n.id === payload.new.id
                ? { ...n, ...payload.new as Partial<Notification> }
                : n
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    loadUnreadCount()
  }, [loadUnreadCount])

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
      loadUnreadCount()
    }
  }
}

