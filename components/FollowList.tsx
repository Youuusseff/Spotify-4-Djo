'use client';

import { useFollowList } from '@/hooks/useFollowList';
import { FollowButton } from './FollowButton';

interface FollowListProps {
  userId: string;
  type: 'followers' | 'following';
  className?: string;
}

export function FollowList({ userId, type, className = '' }: FollowListProps) {
  const { users, isLoading } = useFollowList(userId, type);
  

  if (isLoading) {
    return <div className="animate-pulse">Loading {type}...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {type} yet
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {users.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {item.user.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="font-medium">{item.user.email}</div>
              <div className="text-sm text-gray-500">
                {type === 'followers' ? 'Following you' : 'You follow'}
              </div>
            </div>
          </div>
          <FollowButton targetUserId={item.user.id} />
        </div>
      ))}
    </div>
  );
}