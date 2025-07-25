import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (input?: Song | string) => {
    const supabaseClient = useSupabaseClient();

    if (!input) {
        return null;
    }

    const path = typeof input === "string" ? input : input?.image_path;

    const { data: imageData } = supabaseClient.storage.from("images").getPublicUrl(path ?? "");
    return imageData.publicUrl;
}

export default useLoadImage;