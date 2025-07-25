import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (id?: string | null | undefined): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });
  const {
    data: sessionData,
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return [];
  }

  if (id === undefined || id === null) {
    id = sessionData.session?.user.id;
  }

  const {data, error} = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
  return (data as any) || [];
};

export default getSongsByUserId;
