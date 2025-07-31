// hooks/useFollow.ts
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useFollowList(userId: string, type: 'followers' | 'following') {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!userId) return;

    const getFollowList = async () => {
      setIsLoading(true);

      try {
        let query;
        
        if (type === 'followers') {
          // Get users who follow this userId
          query = supabase
            .from('follows')
            .select(`
              id,
              created_at,
              follower_id,
              public_user_profiles!follows_follower_id_fkey(id, pseudo, bio, avatar_url)
            `)
            .eq('following_id', userId);
        } else {
          // Get users that this userId follows
          query = supabase
            .from('follows')
            .select(`
              id,
              created_at,
              following_id,
              public_user_profiles!follows_following_id_fkey(id, pseudo, bio, avatar_url)
            `)
            .eq('follower_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          setUsers([]);
        } else if (data) {
          const mappedUsers = data.map(item => ({
            id: item.id,
            createdAt: item.created_at,
            user: type === 'followers' 
              ? (item as any).public_user_profiles
              : (item as any).public_user_profiles
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error fetching follow list:', error);
        setUsers([]);
      }

      setIsLoading(false);
    };

    getFollowList();
  }, [userId, type, supabase]);

  return { users, isLoading };
}