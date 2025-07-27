import { Comment } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";



const getCommentsBySongId = async (songId: string): Promise<Comment[] | null> => {

    const supabase = createServerComponentClient({
        cookies: cookies,
    });

    const { data, error } = await supabase.rpc("get_comment_thread", { song_id_input: songId });

    if (error) {
        console.error("Error fetching comments:", error);
        return null;
    }

    return data;
}

export default getCommentsBySongId;