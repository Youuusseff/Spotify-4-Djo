"use client";
import Button from "@/components/Button";
import Comment from "@/components/Comment";
import Input from "@/components/Input";
import { useUser } from "@/hooks/useUser";
import { Comment as CommentType } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ThreadContentProps {
  comments: CommentType[] | null;
  songId: string;
}

const ThreadContent: React.FC<ThreadContentProps> = ({ comments, songId }) => {
  const [replyInput, setReplyInput] = useState(false);
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const [replyText, setReplyText] = useState("");
  const router = useRouter();

  const handleReply = async (parentId: string | null) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    const { error } = await supabaseClient.from("comments").insert({
      content: replyText || "",
      user_id: user.id,
      song_id: songId, 
      parent_id: parentId,
    });

    if (error) {
      console.error("Error inserting reply:", error);
      toast.error("Failed to post reply");
    } else {
      setReplyText("");
      router.refresh();
      toast.success("Reply posted successfully");
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-y-2">
        <p className="text-white">No comments available</p>
        {replyInput && (
          <Input
            placeholder="Type your reply..."
            type="text"
            className="w-[200px]"
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleReply(null);
                setReplyInput(false);
              }
            }}
          />
        )}
        {!replyInput && (
          <Button
            className="mt-2 w-20 "
            onClick={() => {
              setReplyInput(true);
            }}
          >
            Add First Comment
          </Button>
        )}
      </div>
    );
  }

  const commentMap: Record<string, CommentType[]> = {};
  const topLevelComments: CommentType[] = [];

  comments.forEach((comment) => {
    if (!comment.parent_id) {
      topLevelComments.push(comment);
    } else {
      if (!commentMap[comment.parent_id]) {
        commentMap[comment.parent_id] = [];
      }
      commentMap[comment.parent_id].push(comment);
    }
  });

  return (
    <div className="flex flex-col gap-y-4 px-4 py-2">
      {topLevelComments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          replies={commentMap[comment.id] || []}
        />
      ))}
    </div>
  );
};

export default ThreadContent;

