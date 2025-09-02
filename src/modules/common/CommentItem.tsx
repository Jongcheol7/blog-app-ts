import CommentForm from "./CommentForm";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// 더미 데이터
type Comment = {
  id: number;
  content: string;
  createdAt: string;
  blogId: number;
  likes: [
    {
      id: number;
      userId: string;
      blogId: number;
    }
  ];
  user: {
    id: number;
    name: string;
    image: string;
  };
  parentId: number | null;
};

type Props = {
  comment: Comment;
  replies: Comment[];
  depth: number;
  blogId: number;
};
export default function CommentItem({
  comment,
  replies,
  depth = 0,
  blogId,
}: Props) {
  const [showReply, setShowReply] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  //특정 부모에 대한 대댓글 필터링 해보자.
  const getReplies = (id: number) => {
    return replies.filter((c) => c.parentId === id);
  };
  const nextDepth = depth + 1;
  const maxDepth = 3;

  console.log("CommentItem comment: ", comment);

  return (
    <div
      className="mb-4 pt-2 ml-2"
      style={{ paddingLeft: `${Math.min(depth, maxDepth) * 5}px` }}
    >
      {/* 본댓글 */}
      <div className="flex gap-2">
        <Image
          src={comment.user.image}
          //src={""}
          width={30}
          height={30}
          alt="프로필사진"
          className="rounded-full object-cover self-start w-6 h-6"
        />
        <div className="flex-1">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{comment.user.name}</p>
              <p className="text-[11px]">{comment.createdAt}</p>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center ">
              <MessageCircle className="w-4 cursor-pointer hover:text-blue-500 transition" />
              <p className="text-[12px] text-gray-800 flex gap-2 ml-1">
                {getReplies(comment.id).length}
                {"개 "}
                {getReplies(comment.id).length > 0 ? (
                  showReply ? (
                    <span onClick={() => setShowReply(!showReply)}>숨기기</span>
                  ) : (
                    <span onClick={() => setShowReply(!showReply)}>더보기</span>
                  )
                ) : (
                  ""
                )}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCommentForm(!showCommentForm);
                  }}
                >
                  {showCommentForm ? "닫기" : "댓글작성"}
                </span>
              </p>
            </div>
          </div>
          {showCommentForm && (
            <CommentForm blogId={blogId} parentId={comment.id} />
          )}
        </div>
      </div>

      {/* 대댓글 */}
      {showReply && replies && replies.length > 0 && (
        <div>
          {/* 대댓글 재귀 렌더링 */}
          {getReplies(comment.id).map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={replies} // 여기도 전체 댓글 넘겨야 함
              depth={nextDepth}
              blogId={blogId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
