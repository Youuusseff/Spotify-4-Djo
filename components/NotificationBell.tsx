// components/NotificationBell.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Bell,
  Heart,
  MessageCircle,
  Reply,
  ThumbsUp,
  ThumbsDown,
  User,
  X,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from '@/hooks/useNotifications'
import type { Notification } from '@/types'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotificationById,
    navigateToNotification
  } = useNotifications()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBellClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      loadNotifications()
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead([notification.id])
    }
    navigateToNotification(notification)
    setIsOpen(false)
  }

  const handleDeleteNotification = async (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation()
    await deleteNotificationById(notificationId)
  }

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'song_like':
        return <Heart className="w-4 h-4 text-red-500 fill-current" />
      case 'song_comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'comment_reply':
        return <Reply className="w-4 h-4 text-green-500" />
      case 'comment_vote':
        return notification.vote_value === 1 ? (
          <ThumbsUp className="w-4 h-4 text-green-600 fill-current" />
        ) : (
          <ThumbsDown className="w-4 h-4 text-red-600 fill-current" />
        )
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getUserDisplayName = (actor: Notification['actor']) => {
    return actor?.pseudo || 'Someone'
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={handleBellClick}
        className="relative p-2 text-white hover:text-gray-900"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-[280px] md:w-[90vw] max-w-sm sm:w-96 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >

          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold">Notifications</span>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {loading && (
            <div className="p-4 text-sm text-gray-500">Loading...</div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-500">{error}</div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              No notifications found.
            </div>
          )}

          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-2 p-3 cursor-pointer hover:bg-gray-100 ${
                  notification.read ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div>{getNotificationIcon(notification)}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">
                      {getUserDisplayName(notification.actor)}
                    </span>{' '}
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true
                    })}
                  </p>
                </div>
                <button
                  aria-label='Delete notification'
                  onClick={(e) =>
                    handleDeleteNotification(notification.id, e)
                  }
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
