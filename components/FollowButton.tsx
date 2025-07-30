'use client';

import { useFollow } from '@/hooks/useFollow';
import Button from './Button';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
  isFollowing: boolean;
  isLoading: boolean;
  toggleFollow: () => void;
  canFollow: boolean | "" | undefined;
}

export function FollowButton({ targetUserId, className = '', isFollowing, isLoading, toggleFollow, canFollow }: FollowButtonProps) {

  if (!canFollow) return null;

  return (
    <Button
      onClick={toggleFollow}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-2xl font-medium transition-colors
        ${isFollowing 
          ? 'bg-gray-500 text-gray-800 hover:bg-gray-300' 
          : 'bg-[#ba2ce6] text-white hover:opacity-75'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}