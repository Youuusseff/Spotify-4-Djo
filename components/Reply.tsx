"use client";
import { useUser } from "@/hooks/useUser";
import { Comment as CommentType } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Input from "./Input";
import Button from "./Button";

interface ReplyProps {
  reply: CommentType;
}

const Reply: React.FC<ReplyProps> = ({ reply }) => {
    const [replyInput, setReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();
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
    <div className="mb-2">
      <p className="text-gray-400 text-sm">{reply.content}</p>
      {replyInput && <Input placeholder="Type your reply..." type="text" className="w-[100px]" onChange={(e) => setReplyText(e.target.value)} onKeyDown={e=>{
        if (e.key === "Enter") {
          handleReply(reply.id);
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

export default Reply;
