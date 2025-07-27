import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongBySongId = async (id: string): Promise<Song> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.log(error);
  }
  return (data as Song);
};


export default getSongBySongId;