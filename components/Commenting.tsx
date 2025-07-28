"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import useUploadComment from "@/hooks/useUploadComment";
import { FaArrowUp, FaComment, FaReply } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
import { TiArrowDownOutline, TiArrowUpOutline } from "react-icons/ti";
import CommentVoting from "./CommentVoting";


interface CommentingProps {
    button_text?: string;
    parentId: string | null;
    songId: string;
    key?: string;
}


const Commenting: React.FC<CommentingProps> = ({ button_text, parentId, songId, key }) => {

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
            <div className="flex items-center gap-x-2 mb-2">
                {!button_text && (
                    <CommentVoting
                        commentId={parentId || ""}
                    />
                )}
                
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
            </div>
            {replyInput && (
            <div className="relative w-fit">

                <Input
                    placeholder="Type your comment..."
                    type="text"
                    className="md:w-[400px] rounded-2xl bg-neutral-800 text-white p-2 pl-5 pr-10"
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleReply(parentId);
                        setReplyInput(false);
                    }
                    }}
                />
                <IoMdClose className="absolute right-2 top-4 cursor-pointer" onClick={() => setReplyInput(false)} />
            </div>
            )}
      </>
    )
}

export default Commenting;