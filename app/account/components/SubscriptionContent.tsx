"use client";

import Button from "@/components/Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AccountContent = () => {
    const router = useRouter();
    const SubscribeModal = useSubscribeModal();
    const { isLoading, subscription, user } = useUser();

    console.log(subscription);

    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(!isLoading && !user){
            router.replace("/");
        }
    }, [isLoading, user, router]);

    const redirectCustomerPortal = async ()=>{
        setLoading(true);
        try{
            const {url} = await postData({
                url: '/api/create-portal-link'
            });
            window.location.assign(url);
        }
        catch (error) {
            if (error) {
                console.error("Error redirecting to customer portal:", error);
                toast.error("Failed to redirect to customer portal.");
            }
        }
        setLoading(false);
    }

    return(
        <div className="mb-7 px-6 text-center">
            {!subscription && (
                <div className=" justify-center items-center flex flex-col gap-y-4">
                    <p>No active plan.</p>
                    <Button
                        onClick={SubscribeModal.onOpen}
                        className="w-[300px] text-center">
                        Subscribe
                    </Button>
                </div>
            )}
            {subscription && (
                <div className="flex flex-col gap-y-4 justify-center items-center">
                    <p>You are currently on the <b>{subscription?.prices?.products?.name}</b> plan.</p>
                    <Button
                        disabled={loading || isLoading}
                        onClick={redirectCustomerPortal}
                        className="w-[300px]">
                        Open Customer Portal
                    </Button>
                </div>
            )}
        </div>
    )
}

export default AccountContent;