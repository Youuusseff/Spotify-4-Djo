"use client";

import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";

import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";



interface HeaderProps {
    children: React.ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps>=({
    children,
    className
})=>{
    const authModal = useAuthModal();
    const router = useRouter();

    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        //reset any playing songs
        router.refresh();

        if (error){
            toast.error(error.message);
        }
        else{
            toast.success("Logged out successfully");
        }

    }
    return(
        <div className={twMerge(`
            h-fit
            bg-gradient-to-b
            from-emerald-800
            p-6
        `,
            className)}>
            <div className="
                flex
                items-center
                justify-between
                w-full
                mb-4">
                    <div className="
                    hidden
                    md:flex
                    gap-x-2
                    items-center">
                        <button aria-label="left" onClick={()=>router.back} className="rounded-full flex items-center justify-center bg-black hover:opacity-75 transition" >
                            <RxCaretLeft className="text-white" size={35}/>
                        </button>
                        <button aria-label="right" onClick={()=> router.forward} className="rounded-full flex items-center justify-center bg-black hover:opacity-75 transition">
                            <RxCaretRight className="text-white" size={35}/>
                        </button>
                    </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button aria-label="home" className="
                    rounded-full
                    p-2
                    bg-white
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition">
                        <HiHome size={20} className="text-black"/>
                    </button>
                    <button aria-label="search" className="
                    rounded-full
                    p-2
                    bg-white
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition">
                        <BiSearch size={20} className="text-black"/>
                    </button>
                </div>
                <div className="
                flex
                justify-between
                items-center
                gap-x-4">
                    {user ? (
                        <div className="flex gap-x-4 items-center">
                            <Button 
                                onClick={handleLogout}
                                className="
                                    bg-white
                                    px-6
                                    py-2
                                "
                                aria-label="logout"
                            >
                                Logout
                            </Button>
                            <Button
                                onClick={()=> router.push('/account')}
                                className="bg-white"
                                aria-label="account">
                                <FaUserAlt/>
                            </Button>
                        </div>
                    ): (
                            <>
                            <div>
                                <Button
                                onClick={authModal.onOpen}
                                className="
                                    bg-transparent
                                    text-neutral-300
                                    font-medium
                                ">
                                    Sign Up
                                </Button>
                            </div>
                            <div>
                                <Button
                                onClick={authModal.onOpen}
                                className="
                                    bg-white
                                    px-6
                                    py-2
                                ">
                                    Log in
                                </Button>
                            </div>
                            </>
                        )}
                </div>
            </div>
            {children}
        </div>
    )
}
export default Header;