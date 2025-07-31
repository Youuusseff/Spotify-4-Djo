"use client";

import { useFollowList } from "@/hooks/useFollowList";
import { FollowButton } from "./FollowButton";
import { useFollow } from "@/hooks/useFollow";
import { useUser } from "@/hooks/useUser";
import MediaItem from "./MediaItem";

interface FollowListProps {
  userId: string;
  type: "followers" | "following";
  className?: string;
}

export function FollowList({ userId, type, className = "" }: FollowListProps) {
  const { users, isLoading } = useFollowList(userId, type);
  console.log('FollowList users:', users);
  const { user } = useUser();
  const {
    isFollowing,
    isLoading: isFollowingLoading,
    toggleFollow,
    canFollow,
    followersCount,
  } = useFollow(userId);

  if (isLoading) {
    return <div className="animate-pulse">Loading {type}...</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-8 text-gray-500">No {type} yet</div>;
  }

  return (
    <div className={`space-y-4 pt-8 ${className}`}>
      {users.map((item) => (
        <div key={item.user.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem
              data={item.user}
              onClick={() => {}} // No action on click for users
            />
          </div>
        </div>
      ))}
    </div>
  );
}
