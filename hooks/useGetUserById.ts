import { useEffect, useMemo, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { PublicUserDetails} from "@/types"; 

const useGetUserById = (userId: string | undefined) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<PublicUserDetails | undefined>(undefined);
    const supabaseClient = useSupabaseClient();

    useEffect(()=>{
        if(!userId){
            return;
        }
        setIsLoading(true);

        const fetchUser = async () => {
            const { data, error } = await supabaseClient
               .rpc("get_public_user_profile", { user_id: userId })
               .single();
            
            if (error) {
                setIsLoading(false);
                return;
            }
            setUser(data as PublicUserDetails);
            setIsLoading(false);
        }

        fetchUser();
    },[userId, supabaseClient]);

    return useMemo(() => ({
        isLoading,
        user
    }), [isLoading, user]);
}

export default useGetUserById;