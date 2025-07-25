import Header from "@/components/Header"
import SubscriptionContent from "./components/SubscriptionContent";
import ProfileDetails from "./components/ProfileDetails";
import getSongsByUserId from "@/actions/getSongsByUserId";

export const revalidate = 0;


export default async function Account() {

    const songs = await getSongsByUserId();

    return(
        <div
          className="
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
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        Account Settings
                    </h1>
                </div>
            </Header>
            <div className="px-6 mb-7 flex flex-col gap-y-8">
                <ProfileDetails songs={songs} />
                <SubscriptionContent />
            </div>
            
        </div>
    )
}

