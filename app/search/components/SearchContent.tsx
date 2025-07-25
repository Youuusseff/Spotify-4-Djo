"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { PublicUserDetails, Song } from "@/types";

interface SearchContentProps {
  songs: Song[];
  users: PublicUserDetails[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs, users }) => {

  const onPlay = useOnPlay(songs);
  if (songs.length === 0 && users.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 px-6 text-neutral-400 w-full">
        No songs or users found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
        {songs.map((song) => (
            <div key={song.id} className="flex items-center gap-x-4 w-full">
                <div className="flex-1">
                    <MediaItem 
                        onClick={(id: string)=>onPlay(id)}
                        data={song}/>
                </div>
                <LikeButton 
                    songId={song.id}
                    />
            </div>
        ))}
        {users.length > 0 && (
            <div className="mt-6">
                <h2 className="text-white text-lg font-semibold">Users</h2>
                <div className="flex flex-col gap-y-4 mt-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center gap-x-4 w-full">
                            <div className="flex-1">
                                <MediaItem 
                                    data={user}
                                    onClick={() => {}} // No action on click for users
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default SearchContent;
