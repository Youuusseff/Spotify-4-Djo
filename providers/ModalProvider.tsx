"use client";

import AuthModal from "@/components/AuthModal";
import EditModal from "@/components/EditModal";
import FollowersModal from "@/components/FollowersModal";
import Modal from "@/components/Modal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import useParams
import FollowingsModal from "@/components/FollowingModal";
import { useUser } from "@/hooks/useUser";

interface ModalProviderProps {
    products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
    const [isMounted, setIsMounted] = useState(false);
    const params = useParams(); // Get route parameters
    const { user } = useUser();
    const userId = (params?.id as string) || user?.id;

    console.log("URL Params:", params);
    console.log("User ID from URL:", userId);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return null;
    }
    
    return (
        <>
            <AuthModal />
            <UploadModal />
            <SubscribeModal products={products} />
            <EditModal />
            <FollowersModal userId={userId || ''} />
            <FollowingsModal userId={userId || ''} />
        </>
    );
}

export default ModalProvider;