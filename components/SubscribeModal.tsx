"use client";

import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface SubscribeModalProps {
    products: ProductWithPrice[];
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
    const SubscribeModal = useSubscribeModal();
    console.log("SubscribeModal products:", products);

    const { user, isLoading, subscription} = useUser();

    const [priceIdLoading, setPriceIdLoading] = useState<string | null>(null); 
    
    const onChange = (open: boolean) => {
        if (!open) {
            SubscribeModal.onClose();
        }
    }

    const handleCheckout = async (price: Price)=> {
        setPriceIdLoading(price.id);
        if (!user) {
            setPriceIdLoading(null);
            return toast.error("You must be logged in.");
        }
        if (subscription) {
            setPriceIdLoading(null);
            return toast("You already have an active subscription.");
        }
        try {
            const {sessionId} = await postData({
                url:"/api/create-checkout-session",
                data: {price}
            });

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error("Error redirecting to checkout:", error);
            toast.error("Failed to redirect to checkout.");
        } finally {
            setPriceIdLoading(null);
        }
    }

    const formatPrice = (price: Price | null) => {
        const priceString = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price?.currency,
            minimumFractionDigits: 0,
        }).format((price?.unit_amount || 0) / 100);

        return priceString;
    }

    let content = (
        <div className="text-center">
            No products available.
        </div>
    );

    if (products.length) {
        content = (
            <div>
                {products.map((product) => {
                    if (!product.prices?.length) {
                        return (
                            <div key={product.id}>
                                No prices available for {product.name}
                            </div>
                        );
                    }

                    return product.prices.map((price) => (
                        <Button key={price.id}
                            onClick={()=> handleCheckout(price)}
                            disabled={isLoading || price.id === priceIdLoading}
                            className="mb-4">
                            {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
                        </Button>
                    ));
                })}
            </div>
        );
    }

    if (subscription){
        content = (
            <div className="text-center">
                Already subscribed
            </div>
        )
    }

    return (
        <Modal
            title="Subscribe to Premium"
            description="Get access to all the features and benefits of Spotify Premium."  
            isOpen={SubscribeModal.isOpen}
            onChange={onChange}
        >
            {content}
        </Modal>
    );
}

export default SubscribeModal;