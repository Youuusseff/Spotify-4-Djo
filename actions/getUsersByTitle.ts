import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PublicUserDetails } from "@/types";

const getUsersByTitle = async (title: string): Promise<PublicUserDetails[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies,});

    if (!title) {
        return [];
    }

    const { data, error } = await supabase
        .rpc("get_public_user_profiles", { term: title })
    
    if (error) {
        console.error("Error fetching users by title:", error);
    }
    
    return (data as PublicUserDetails[]) || [];
    
}

export default getUsersByTitle;