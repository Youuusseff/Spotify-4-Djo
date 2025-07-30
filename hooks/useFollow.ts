import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from './useUser';
import toast from 'react-hot-toast';
import useGetUserById from './useGetUserById';


export function useFollow(targetUserId: string) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const supabase = createClientComponentClient();
  const targetUserDetails = useGetUserById(targetUserId);
  const { user } = useUser();

  // Check if current user is following the target user
  useEffect(() => {
    if (!user?.id || !targetUserId) return;

    const checkFollowStatus = async () => {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

      setIsFollowing(!!data);
    };

    checkFollowStatus();
  }, [user?.id, targetUserId, supabase]);

  // Get followers count for the target user
  useEffect(() => {
    if (!targetUserId) return;

    const getFollowersCount = async () => {
      const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      setFollowersCount(count || 0);
    };

    getFollowersCount();

    const subscription = supabase
      .channel('follows_count')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'follows',
          filter: `following_id=eq.${targetUserId}`
        }, 
        () => getFollowersCount()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [targetUserId, supabase]);

  const toggleFollow = async () => {
    if (!user?.id || !targetUserId || isLoading) return;

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;
        setIsFollowing(false);
        toast.success(`You have unfollowed ${targetUserDetails.user?.pseudo|| 'this user'}`);
        setFollowersCount(prev => prev - 1);
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          });

        if (error) throw error;
        setIsFollowing(true);
        toast.success(`You are now following ${targetUserDetails.user?.pseudo|| 'this user'}`);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFollowing,
    isLoading,
    followersCount,
    toggleFollow,
    canFollow: user?.id && user.id !== targetUserId
  };
}
