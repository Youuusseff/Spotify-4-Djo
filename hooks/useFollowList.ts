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

      let query;
      
      if (type === 'followers') {
        query = supabase
          .from('follows')
          .select(`
            id,
            created_at,
            follower_id,
            follower:follower_id(id, email)
          `)
          .eq('following_id', userId);
      } else {
        query = supabase
          .from('follows')
          .select(`
            id,
            created_at,
            following_id,
            following:following_id(id, email)
          `)
          .eq('follower_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (data && !error) {
        const mappedUsers = data.map(item => ({
          id: item.id,
          createdAt: item.created_at,
          user: type === 'followers' 
            ? (item as any).follower 
            : (item as any).following
        }));
        setUsers(mappedUsers);
      }

      setIsLoading(false);
    };

    getFollowList();
  }, [userId, type, supabase]);

  return { users, isLoading };
}