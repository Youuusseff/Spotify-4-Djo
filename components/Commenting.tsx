"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import useUploadComment from "@/hooks/useUploadComment";
import { FaArrowUp, FaComment, FaReply } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
import { AiOutlineSend } from "react-icons/ai";
import CommentVoting from "./CommentVoting";


const MAX_DEPTH = 3; 

interface CommentingProps {
    button_text?: string;
    parentId: string | null;
    songId: string;
    key?: string;
    depth: number;
}


const Commenting: React.FC<CommentingProps> = ({ button_text, parentId, songId, key, depth }) => {

    const [replyInput, setReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const uploadComment = useUploadComment();

    const handleReply = async (parentId: string | null ) => {
        await uploadComment(parentId, replyText, songId);
        setReplyText("");
        setReplyInput(false);
    };

    return(
        <>
            <div className="flex items-center gap-x-2 mb-2 ml-14">
                {!button_text && (
                    <CommentVoting
                        commentId={parentId || ""}
                    />
                )}
                {depth < MAX_DEPTH && (
                <Button
                    className="text-white p-1 flex align-center bg-[#171717] hover:bg-gray-600 w-fit"
                    onClick={() => {
                    setReplyInput(true);
                    }}
                >
                    {
                        button_text ? <p className="p-3 bg-gray-600 rounded-2xl ">{button_text}</p> : (
                        <div className="flex items-center gap-x-2 p-y-1">
                            <FaComment className="inline mr-1" />
                            <p className="text-gray-400 text-sm">reply</p>   
                        </div>
                    )}
                </Button>
            )}
            </div>
            {replyInput && (
            <div className="relative w-fit ml-10">

                <textarea
                    placeholder="Type your comment..."
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto"; 
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply(parentId);
                        setReplyInput(false);
                        }
                    }}
                    className="hidden md:block w-full max-w-full rounded-2xl bg-neutral-800 text-white pt-2 pl-5 pr-15 resize-none overflow-hidden"
                />
                <textarea
                    placeholder="Type your comment..."
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto"; 
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    className="md:hidden w-full max-w-full rounded-2xl bg-neutral-800 text-white pt-2 pl-5 pr-15 resize-none overflow-hidden"
                />
                <div className="absolute right-4 top-4">
                    <div className="flex items-center gap-x-2">
                        <IoMdClose className="cursor-pointer" onClick={() => setReplyInput(false)} />
                        <AiOutlineSend className="cursor-pointer" onClick={() => {handleReply(parentId); setReplyInput(false)}} />
                    </div>    
                </div>
            </div>
            )}
      </>
    )
}

export default Commenting;