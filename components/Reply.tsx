import { Comment as CommentType } from "@/types";
import Commenting from "./Commenting";
import Button from "./Button";
import { useRouter } from "next/navigation";
import useGetUserById from "@/hooks/useGetUserById";
import useLoadImage from "@/hooks/useLoadImage";
import { FaUserAlt } from "react-icons/fa";

interface ReplyProps {
  reply: CommentType;
  songId: string;
  replies: CommentType[];
  commentMap: Record<string, CommentType[]>;
  depth?: number;
}

const Reply: React.FC<ReplyProps> = ({ reply, songId, replies, commentMap, depth = 1 }) => {
  const router = useRouter();
  const { user } = useGetUserById(reply.user_id);
  const profile_picture = useLoadImage(user?.avatar_url);
  return (
    <div className="ml-5 mb-2">
      <div className="flex items-center gap-x-2 mb-2">
        <Button
          onClick={()=> router.push('/profiles/' + reply.user_id)}
          className="bg-white p-0 w-fit h-fit rounded-full hover:bg-gray-200 transition"
          aria-label="account">
          {profile_picture ? (
            <img src={profile_picture} alt="Profile" className="w-9 h-9 rounded-full"/>
            ) : (
            <FaUserAlt size={24} className="m-1"/>
          )}
        </Button>
        <span className="text-gray-400 text-sm ml-2">{user?.pseudo}</span>
      </div>
      <div className="border-l border-gray-700 ml-4">
        <div className="w-fit">
          <p className="text-gray-400 text-sm pl-4 break-words">{reply.content}</p>
          <div className="mt-2">
            <Commenting songId={songId} parentId={reply.id} depth={depth} />
          </div>
        </div>
        <div className="pl-4 border-l border-gray-700 mt-4">
          {replies.map((reply) => (
            <Reply key={reply.id} reply={reply} songId={songId} replies={commentMap[reply.id] || []} commentMap={commentMap} depth={depth ? depth + 1 : 1} />
          ))}
        </div>

      </div>
      
    </div>
  );
};

export default Reply;
