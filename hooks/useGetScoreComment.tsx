import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useCallback, useEffect, useState } from "react";
import { useUser } from "./useUser";

const useGetScoreComment = (commentId: string | null | undefined) => {
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();
    const [score, setScore] = useState<number | null>(null);
    const [userVote, setUserVote] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchScore = useCallback(async () => {
        if (!commentId) {
            console.log("No commentId provided");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {

            const { data, error } = await supabaseClient
                .from("comment_votes")
                .select("vote, user_id")
                .eq("comment_id", commentId);

            if (error) {
                console.error("Query error:", error);
                setError(`Query error: ${error.message}`);
                return;
            }

            console.log("Query successful, data:", data);

            if (data && data.length > 0) {
                const checkForUserVote = data.find(vote => vote.user_id === user?.id);
                if (checkForUserVote) {
                    setUserVote(checkForUserVote.vote);
                } else {
                    setUserVote(null);
                }
                const totalScore = data.reduce((acc, vote) => acc + (vote.vote || 0), 0);
                setScore(totalScore);
            } else {
                setScore(0);
                setUserVote(null);
            }
        } catch (err) {
            console.error("Network/fetch error:", err);
            setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    }, [commentId, supabaseClient, user?.id]);

    useEffect(() => {
        fetchScore();
    }, [fetchScore]);

    return { 
        score, 
        userVote, 
        loading,
        error,
        refetch: fetchScore
    };
};

export default useGetScoreComment;