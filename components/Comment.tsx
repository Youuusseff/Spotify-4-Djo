"use client";
import { Comment as CommentType } from "@/types";
import Reply from "./Reply";
import Commenting from "./Commenting";
import Button from "./Button";
import { useRouter } from "next/navigation";
import useGetUserById from "@/hooks/useGetUserById";
import useLoadImage from "@/hooks/useLoadImage";
import { FaUserAlt } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


dayjs.extend(relativeTime);


interface CommentProps {
  comment: CommentType;
  replies: CommentType[];
  songId: string;
  commentMap: Record<string, CommentType[]>;
}

const Comment: React.FC<CommentProps> = ({ comment, replies, songId, commentMap }) => {

  const router = useRouter();
  const {user} = useGetUserById(comment.user_id);
  const profile_picture = useLoadImage(user?.avatar_url);
  console.log("comment by ", user?.pseudo, "with id", comment.user_id, "and content", comment.content);
  const rawDate = comment.created_at;
  const displayDate = dayjs(rawDate).fromNow();

  return (
    <div className="mb-4 flex flex-col" id={`comment-${comment.id}`}>
      <div className="flex items-center gap-x-2 mb-2">
        <Button
          onClick={()=> router.push(`/profiles/${comment.user_id}`)}
          className="bg-white p-0 w-fit h-fit rounded-full hover:bg-gray-200 transition"
          aria-label="account">
          {profile_picture ? (
            <img src={profile_picture} alt="Profile" className="w-9 h-9 rounded-full object-cover"/>
            ) : (
            <FaUserAlt size={24} className="m-1"/>
          )}
        </Button>
        <span className="text-gray-400 text-sm ml-2">{user?.pseudo}</span>
        <span className="text-gray-300 text-xs ml-2">{displayDate}</span>
      </div>
      <div className="border-l border-gray-700 ml-4">
        <div className="w-full max-w-full relative ">
          <p className="text-white text-lg pl-4 break-words whitespace-pre-line">{comment.content}</p>
          <div className=" mt-2">
            <Commenting depth={1} songId={songId} parentId={comment.id} />
          </div>
        </div>
        
        <div className="ml-0 mt-4">
          {replies.map(reply => (
            <Reply key={reply.id} reply={reply} songId={songId} replies={commentMap[reply.id] || []} commentMap={commentMap} />
          ))}
          
        </div>

      </div>
      
    </div>
  );
};

export default Comment;
