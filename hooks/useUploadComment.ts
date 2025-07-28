import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "./useUser";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const useUploadComment = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const uploadComment = async (parentId: string | null, comment: string, songId: string) => {
    if (!user) {
      toast.error("You must be logged in to post a comment");
      router.replace("/");
      return;
    }

    const { error } = await supabaseClient
      .from("comments")
      .insert({
        parent_id: parentId,
        user_id: user.id,
        song_id: songId,
        content: comment || "",
      });

    if (error) {
      console.error("Error inserting comment:", error);
      toast.error("Failed to post comment");
      return;
    } 
    toast.success("Comment posted successfully");
    router.refresh();
  };

  return uploadComment;
};

export default useUploadComment;
