import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import getUsersByTitle from "@/actions/getUsersByTitle";

interface SearchProps {
  searchParams: Promise<{
    title: string;
  }>;
}

export const revalidate = 0; // Disable revalidation for this page

const Search = async ({ searchParams }: SearchProps) => {
  const { title } = await searchParams;
  const songs = await getSongsByTitle(title);
  const users = await getUsersByTitle(title);

  return(
    <div
        className="
            bg-neutral-900
            rounded-lg
            h-full
            w-full
            overflow-hidden
            overflow-y-auto
        ">
        <Header className="bg-[linear-gradient(to_bottom,#3b094a,#171717)]" >
            <div className="mb-2 flex flex-col gap-y-6">
                <h1 className="text-white text-3xl font-semibold">
                    Search
                </h1>
                <SearchInput />
            </div>
        </Header>
        <SearchContent songs={songs} users={users} />
    </div>
  )
};

export default Search;
