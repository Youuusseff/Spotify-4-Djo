"use client";

import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import { PublicUserDetails, Song } from "@/types";
import Button from "@/components/Button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

interface ThreadHeaderProps {
    song: Song,
    public_user: PublicUserDetails | null;
}

const ThreadHeader: React.FC<ThreadHeaderProps> = ({ song, public_user }) => {
    const rawDate = song?.created_at;
    const router = useRouter();
    const profile_picture = useLoadImage(public_user?.avatar_url);
    const formattedDate = dayjs(rawDate).format("DD MMM YYYY");
    const {user, isLoading} = useUser();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);



    const imageUrl = useLoadImage(song) || "/images/liked.png";

    return(
        <div className="flex justify-around items-center mt-10">
                    <div className="mb-2 flex flex-col flex-start gap-y-6">
                        <h1 className="text-white text-3xl font-semibold">
                            {song.title}
                        </h1>
                        <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-y-2 md:gap-x-10">
                            <div className="flex items-center gap-x-4 ">
                                <Button
                                    onClick={()=> router.push('/profile/' + public_user?.id)}
                                    className="bg-white p-1 rounded-full w-12 h-12"
                                    aria-label="account">
                                    {profile_picture ? (
                                        <img src={profile_picture} alt="Profile" className="w-10 h-10 rounded-full"/>
                                    ) : (
                                        <FaUserAlt size={24} className="m-1"/>
                                    )}
                                </Button>
                                <p className="text-xl">{public_user?.pseudo}</p>
                            </div>
                            
                            <p className="text-sm text-neutral-400">uploaded at : {formattedDate}</p>
                        </div>
                    </div>
                    <div className="px-6 mb-7  flex flex-col justify-center items-center gap-y-8">
                        <div className=" bg-neutral-400/5 hover:bg-neutral-400/10 relative aspect-square w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-md overflow-hidden">
                            <Image
                                className="object-cover"
                                src={imageUrl}
                                alt={song.title}
                                fill
                            />
                        </div>
                        
                    </div>
        </div>
    )
}

export default ThreadHeader;
                
