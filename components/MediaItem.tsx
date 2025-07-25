"use client";
import useLoadImage from "@/hooks/useLoadImage";
import {PublicUserDetails, Song} from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MediaItemProps {
    data: Song | PublicUserDetails;
    onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {

    const router = useRouter();
    

    const isSong = (data: Song | PublicUserDetails): data is Song => {
        return 'title' in data;
    };

    // Get image URL based on type
    const imageParam = isSong(data) ? data : (data as PublicUserDetails).avatar_url;
    const imageUrl = useLoadImage(imageParam);

    const handleClick = () => {
        if (onClick) {
            
            if (isSong(data)) {
            // Handle song play logic here
            
            console.log("Playing song:", data.title);
            return onClick(data.id);
            } 
            else {
            // Navigate to user profile
            router.push(`/profiles/${data.id}`);
            }
        }
    }

    return (
        <div
            onClick={handleClick}
            className="
                flex
                items-center
                gap-x-3
                cursor-pointer
                hover:bg-neutral-800/50
                w-full
                p-2
                rounded-md">
                    <div
                        className="
                            relative
                            rounded-md
                            min-h-[48px]
                            min-w-[48px]
                            overflow-hidden
                        ">
                        <Image 
                            fill
                            src={imageUrl || '/images/liked.png'}
                            alt="media Item"
                            className="object-cover"
                        />
                    </div>
                    {isSong(data) && (
                        <div className="flex flex-col gap-y-1 overflow-hidden">
                            <p className="text-white truncate">{data.title}</p>
                            <p className="text-neutral-400 text-sm truncate">{data.author}</p>
                        </div>
                    )}
                    {!isSong(data) && (
                        <div className="flex flex-col gap-y-1 overflow-hidden">
                            <p className="text-white truncate">{data.pseudo}</p>
                            <p className="text-neutral-400 text-sm truncate">{data.bio || "No bio"}</p>
                        </div>
                    )}
        </div>
    )
}

export default MediaItem;