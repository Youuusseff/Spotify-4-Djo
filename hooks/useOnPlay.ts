import { Song } from "@/types";
import useAuthModal from "./useAuthModal";
import usePlayer from "./usePlayer";
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const authModal = useAuthModal();
    const SubscribeModal = useSubscribeModal();
    const { user, subscription } = useUser();

    const onPlay = (id: string) => {
        if (!user){
            return authModal.onOpen();
        }

        if (!subscription){
            return SubscribeModal.onOpen();
        }

        player.setId(id);
        player.setIds(songs.map((song) => song.id));
    };

    return onPlay;
}

export default useOnPlay;