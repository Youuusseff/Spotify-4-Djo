import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PublicUserDetails } from "@/types"; 

const getUserById = async (userId: string): Promise<PublicUserDetails | null> => {
    const supabase = createServerComponentClient({
        cookies: cookies,
    });

    const { data, error } = await supabase
        .rpc("get_public_user_profile", { user_id: userId });

    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }

    // Since rpc returns an array, get the first item
    if (!data || data.length === 0) {
        return null;
    }

    return data[0] as PublicUserDetails;
}

export default getUserById;