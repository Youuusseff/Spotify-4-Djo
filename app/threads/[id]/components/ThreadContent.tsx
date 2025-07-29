import Comment from "@/components/Comment";
import Commenting from "@/components/Commenting";
import { Comment as CommentType } from "@/types";


interface ThreadContentProps {
  comments: CommentType[] | null;
  songId: string;
}

const ThreadContent: React.FC<ThreadContentProps> = ({ comments, songId }) => {


  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-y-2 mr-14">
        <p className="text-white ml-14">No comments available</p>
        <Commenting button_text="Be first to comment" parentId={null} songId={songId} />
      </div>
    );
  }

  const commentMap: Record<string, CommentType[]> = {};
  const topLevelComments: CommentType[] = [];

  comments.forEach((comment) => {
    if (!comment.parent_id) {
      topLevelComments.push(comment);
    } else {
      if (!commentMap[comment.parent_id]) {
        commentMap[comment.parent_id] = [];
      }
      commentMap[comment.parent_id].push(comment);
    }
  });

  return (
    <div className="flex flex-col gap-y-4 px-4 py-2 mr-5 w-full max-w-[500px] md:max-w-full">
      {topLevelComments.map((comment) => (
        <div key={comment.id} className="border-b border-gray-700 pb-4">
          <Comment
            key={comment.id}
            comment={comment}
            songId={songId}
            replies={commentMap[comment.id] || []}
            commentMap={commentMap}
          /> 
        </div>
      ))}
      <div className="mt-4">
        <Commenting depth={1} button_text="Add Comment" parentId={null} songId={songId} />
      </div>
    </div>
  );
};

export default ThreadContent;

