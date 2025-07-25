"use client";

import Button from "@/components/Button";
import Image from "next/image";
import { HiHome, HiPencil } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import useLoadImage from "@/hooks/useLoadImage";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { Song } from "@/types";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useEditModal from "@/hooks/useEditModal";


interface ProfileDetailsProps {
    songs: Song[];
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ songs }) => {

    const router = useRouter();
    const { user, userDetails, isLoading, setUserDetails } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onPlay = useOnPlay(songs);
    const supabase = useSupabaseClient();
    const editModal = useEditModal();

    useEffect(()=>{
        if (!isLoading && !user) {
            router.replace("/");
        }
    }, [isLoading, user, router]);

    const imageUrl = useLoadImage(userDetails?.avatar_url)
    const userName = userDetails?.pseudo || "Username";
    const userBio = userDetails?.bio || "Your bio goes here.";
    const handleEditProfile = () => {
        editModal.onOpen();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            return toast.error("You must be logged in to upload a profile picture.");
        }
        const file = event.target.files?.[0];
        if (!file){
            return toast.error("Please select an image file.");
        }
        
        const filePath = `avatars-${user?.id}-${file.name}`;
        const { data, error } = await supabase.storage.from("images").upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
        });
        if (error) {
            return toast.error("Failed to upload image.");
        }
        const { error: supabaseError } = await supabase
            .from("users")
            .update({ avatar_url: filePath })
            .eq("id", user?.id);
        
        if (supabaseError) {
            return toast.error("Failed to update profile picture.");
        }
        

        toast.success("Profile picture updated successfully.");

        setUserDetails({
            ...userDetails!,
            avatar_url: filePath,
        });
        
        
    }



    return (
        <div className="
            p-6
            flex
            flex-col
            gap-y-6">
            <div className="flex justify-center items-center w-full gap-x-18">
                <div className="relative
                        w-26
                        h-26
                        rounded-full
                        overflow-hidden
                        flex-shrink-0"
                        onClick={() => fileInputRef.current?.click()}>
                    <input type="file"
                           aria-label="Upload Profile Picture"
                           ref={fileInputRef}
                           accept="image/*"
                           className="hidden"
                           onChange={handleImageUpload}
                    />
                    <Image
                    src={imageUrl ? imageUrl : "/images/image.png"}
                    alt="Profile Picture"
                    className="rounded-full object-cover cursor-pointer hover:opacity-75 transition"
                    fill
                    />
                </div>
                <div className="flex flex-col items-start gap-y-4">
                    <div className="flex gap-x-4 items-center">
                        <h2 className="text-white text-xl  md:text-2xl font-semibold">{userName}</h2>
                        <Button className="w-fit mt-1 bg-neutral-700 hover:bg-neutral-600 transition"
                                onClick={handleEditProfile}
                        >
                            <HiPencil />
                        </Button>
                    </div>
                    
                    <p className="text-neutral-400">
                        {userBio}
                    </p>
                </div>
                
            </div>
            
            <div className="flex flex-col gap-y-4">
                <h3 className="text-white text-lg font-semibold">Uploaded Songs</h3>
                <p className="text-neutral-400">
                    {songs.length} songs uploaded
                </p>
                    {songs.length > 0 ? (
                        <div className="flex flex-col gap-y-2 w-full px-6">
                            {songs.map((song) => (
                                <div key={song.id} className="flex items-center gap-x-4 w-full">
                                    <div className="flex-1">
                                        <MediaItem 
                                            onClick={(id: string)=>onPlay(id)}
                                            data={song}
                                        />
                                    </div>
                                    <LikeButton 
                                        songId={song.id}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span>No songs uploaded yet.</span>
        )}

            </div>
        </div>
    )
}

export default ProfileDetails;