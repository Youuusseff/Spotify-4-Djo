"use client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import useGetScoreComment from "@/hooks/useGetScoreComment";
import { TiArrowDownOutline, TiArrowUpOutline } from "react-icons/ti";
import Button from "./Button";
import toast from "react-hot-toast";

interface CommentVotingProps {
  commentId?: string | null;
}

const CommentVoting: React.FC<CommentVotingProps> = ({ commentId }) => {
  const { score, userVote, loading, refetch } = useGetScoreComment(commentId);
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleVote = async (voteValue: number) => {
    if (!user) return;

    try {
      const { data: existingVote } = await supabaseClient
        .from("comment_votes")
        .select("id, vote")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote === voteValue) {
          const { error } = await supabaseClient
            .from("comment_votes")
            .update({ vote: 0 })
            .eq("id", existingVote.id);
           if (error) {
              console.error("Error removing vote:", error);
              toast.error("Failed to remove vote");
              return;
            }
            toast.success("Vote removed successfully");
        } else {
          const { error } = await supabaseClient
            .from("comment_votes")
            .update({ vote: voteValue })
            .eq("id", existingVote.id);
          if (error) {
            console.error("Error updating vote:", error);
            toast.error("Failed to update vote");
            return;
          }
            toast.success("Vote updated successfully");
        }
      } else {
        const { error } = await supabaseClient
          .from("comment_votes")
          .insert({
            comment_id: commentId,
            user_id: user.id,
            vote: voteValue
          });
        if (error) {
          console.error("Error inserting vote:", error);
          toast.error("Failed to vote");
          return;
        }
        toast.success("Voted successfully");
      }
      
      await refetch();
      
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <span className="text-sm font-medium">
          {loading ? "..." : score || 0}
      </span>
      <Button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`text-gray-400 p-1 flex align-center  w-fit ${
          userVote === 1 
            ? 'bg-[#ba2ce6] text-white' 
            : 'bg-[#171717] hover:bg-gray-600'
        }`}
      >
        <TiArrowUpOutline className="inline" />
      </Button>
      
      
      
      <Button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`text-gray-400 p-1 flex align-center  w-fit ${
          userVote === -1 
            ? 'bg-[#ba2ce6] text-white' 
            : 'bg-[#171717] hover:bg-gray-600'
        }`}
      >
        <TiArrowDownOutline size={16} className="inline" />
      </Button>
    </div>
  );
};

export default CommentVoting;