"use client";
import { Comment as CommentType } from "@/types";
import Reply from "./Reply";
import Button from "./Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Input from "./Input";
interface CommentProps {
  comment: CommentType;
  replies: CommentType[];
}

const Comment: React.FC<CommentProps> = ({ comment, replies }) => {
    const [replyInput, setReplyInput] = useState(false);
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();
    const [replyText, setReplyText] = useState("");
    const router = useRouter();
    const handleReply = async (parentId: string) => {
        if(!user) {
            console.log("User not logged in");
            return;
        }
        console.log("Reply to comment with ID:", parentId);
        const { error } = await supabaseClient
            .from("comments")
            .insert({
                content: replyText || "",
                user_id: user.id,
                parent_id: parentId,
            });

        if (error) {
            console.error("Error inserting reply:", error);
            toast.error("Failed to post reply");
        }
        else {
            setReplyText("");
            router.refresh();
            toast.success("Reply posted successfully");
        }

    };
  return (
    <div className="mb-4" id={`comment-${comment.id}`}>
      <p className="text-white text-lg">{comment.content}</p>

      <div className="ml-6">
        {replies.map(reply => (
          <Reply key={reply.id} reply={reply} />
        ))}
        
      </div>
      {replyInput && <Input placeholder="Type your reply..." type="text" className="w-[100px]" onChange={(e) => setReplyText(e.target.value)} onKeyDown={e=>{
        if (e.key === "Enter") {
          handleReply(comment.id);
          setReplyInput(false);
        }
      }} />}
      {!replyInput && <Button
            className="mt-2 w-20"
            onClick={() => {
                setReplyInput(true);
            }}
        >
            Reply
        </Button>
        }
    </div>
  );
};

export default Comment;
