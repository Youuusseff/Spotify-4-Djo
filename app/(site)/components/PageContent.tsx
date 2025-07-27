"use client";

import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import useToggleState from "@/hooks/useToggleState";
import { Song } from "@/types";
import { useRouter } from "next/navigation";

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({
    songs
}) => {
    const router = useRouter();
    const onPlay = useOnPlay(songs);
    const toggleState = useToggleState();

    const handleClick = (songid: string) => {
        console.log("Song ID Clicked:", songid);
        onPlay(songid);
        if (toggleState.isEnabled) {
            router.push(`/threads/${songid}`); 
        }
        
    };

    if (songs.length === 0) {
        return (
            <div className="text-neutral-400 text-center mt-6">
                No songs available.
            </div>
        );
    }
    

    return (
        <div
            className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-8
                gap-4
                mt-4
                ">
            {songs.map((song) => (
                <SongItem
                    key={song.id}
                    onClick={() => handleClick(song.id)}
                    data={song}
                />))}
        </div>
    )
}

export default PageContent;