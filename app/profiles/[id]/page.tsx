import ProfileDetails from "@/components/ProfileDetails";
import Header from "@/components/Header";
import getUserById from "@/actions/getUserById";
import getSongsByUserId from "@/actions/getSongsByUserId";


interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
    const userId = params.id;
    const user = await getUserById(userId);
    const songs = await getSongsByUserId(userId); // Assuming you have a function to get songs by user ID
    if (!user) {
        return <div className="text-white">User not found</div>;
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
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        {user?.pseudo} Profile
                    </h1>
                </div>
            </Header>
            <div className="px-6 mb-7 flex flex-col gap-y-8">
                <ProfileDetails user={user} songs={songs} />
            </div>
        </div>
    )

}

export default ProfilePage;