import Header from "@/components/Header";
import getUserById from "@/actions/getUserById";
import getSongBySongId from "@/actions/getSongBySongId";
import ThreadContent from "./components/ThreadContent";

import Button from "@/components/Button";



interface ThreadPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ThreadPage = async ({ params }: ThreadPageProps) => {

    const {id:SongId}  = await params;
    const song = await getSongBySongId(SongId);
    const user = await getUserById(song?.user_id);
    
    if (!song) {
        return <div className="text-white">Song not found</div>;
    }


    return(
        <div className="
          bg-neutral-900
            rounded-lg
            h-full
            w-full
            overflow-hidden
            overflow-y-auto
            flex
            flex-col
            gap-y-6">
            <Header className="bg-[linear-gradient(to_bottom,#410454,#171717)]">
                    <ThreadContent song={song} user={user} />
            </Header>
        </div>
    )

}

export default ThreadPage;