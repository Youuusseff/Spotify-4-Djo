"use client";

import { PublicUserDetails, Song } from "@/types";
import Image from "next/image";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import useLoadImage from "@/hooks/useLoadImage";
import useOnPlay from "@/hooks/useOnPlay";
import { FollowButton } from './FollowButton';
import { useFollow } from "@/hooks/useFollow";
import useFollowModal from "@/hooks/useFollowModal";



interface ProfileDetailsProps {
    user: PublicUserDetails;
    songs: Song[];
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, songs }) => {
    const userName = user?.pseudo || "Unknown User";
    const userBio = user?.bio || "No bio available.";
    const onPlay = useOnPlay(songs);
    const { isFollowing, isLoading, toggleFollow, canFollow, followersCount } = useFollow(user.id);
    const userImageUrl = useLoadImage(user?.avatar_url);
    const imageUrl = userImageUrl || '/images/image.png';
    const FollowModal = useFollowModal();

    return(
        <div className="
            p-6
            flex
            flex-col
            gap-y-6">
            <div className="flex flex-col md:flex-row  gap-x-20 justify-center items-center w-full gap-y-6">
                <div className="flex items-center md:gap-x-18 gap-x-5">
                    <div className="relative
                        w-26
                        h-26
                        rounded-full
                        overflow-hidden
                        flex-shrink-0"
                    >
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
                        </div>
                        <p className="text-neutral-400 min-w-[120px]">
                            {userBio}
                        </p>
                    </div>
                    <FollowButton targetUserId={user.id} isFollowing={isFollowing} isLoading={isLoading} toggleFollow={toggleFollow} canFollow={canFollow} />
                </div>
                <div className="flex items-center gap-x-4">
                        <div className="flex flex-col items-center">
                            <h4 className="text-white text-lg font-semibold">Followers</h4>
                            <p className="text-neutral-400">{followersCount || 0}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="text-white text-lg font-semibold">Following</h4>
                            <p className="text-neutral-400">{user?.following || 0}</p>
                        </div>
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