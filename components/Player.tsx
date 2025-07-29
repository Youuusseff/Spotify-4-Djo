"use client";

import { useEffect, useState } from 'react';
import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
    const player = usePlayer();
    const hidden = usePlayer(state => state.hidden);
    const activeId = usePlayer(state => state.activeId);
    const { song } = useGetSongById(activeId);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const songUrl = useLoadSongUrl(song!);
    console.log("player hidden or not", hidden);

    useEffect(() => {
        // Only run on mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) return;

        let initialViewportHeight = window.visualViewport?.height || window.innerHeight;
        
        const handleViewportChange = () => {
            const currentHeight = window.visualViewport?.height || window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            // If viewport shrunk by more than 150px, assume keyboard is open
            setIsKeyboardOpen(heightDifference > 150);
        };

        // Use Visual Viewport API if available (most modern mobile browsers)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
            return () => {
                window.visualViewport?.removeEventListener('resize', handleViewportChange);
            };
        } else {
            // Fallback for older browsers
            window.addEventListener('resize', handleViewportChange);
            return () => {
                window.removeEventListener('resize', handleViewportChange);
            };
        }
    }, []);

    if (!song || !songUrl || !activeId) {
        return null;
    }

    // Hide if manually hidden OR if mobile keyboard is open
    const shouldHide = hidden || isKeyboardOpen;

    return (
        <div
            className={`fixed bottom-0 bg-black w-full py-2 h-[80px] px-4 transition-opacity duration-200 ${shouldHide ? 'invisible opacity-0' : 'visible opacity-100'}`}
        >
            <PlayerContent
                key={songUrl}
                song={song}
                songUrl={songUrl} />
        </div>
    )
}

export default Player;