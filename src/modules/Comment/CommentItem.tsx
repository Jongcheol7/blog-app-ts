import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentForm from "./CommentForm";
import { MessageCircle, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { TimeTransform } from "../common/TimeTransform";
import { useSession } from "next-auth/react";
import { useCommentDeleteMutation } from "@/hooks/useCommentMutation";

// 더미 데이터
type Comment = {
  id: number;
  content: string;
  createdAt: string;
  blogId: number;
  secretYn: boolean;
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
  const { data: session } = useSession();
  const {
    mutate: delMutate,
    isPending,
    isSuccess,
  } = useCommentDeleteMutation();

  const isAdmin = session?.user.isAdmin;
  const isOwner = String(session?.user.id) === String(comment.user.id);
  const isEditable = isAdmin || isOwner;

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
      <div
        className="flex items-start gap-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-md transition"
        style={{ paddingLeft: `${Math.min(depth, maxDepth) * 5}px` }}
      >
        {/* 아바타 */}
        <Avatar className="h-9 w-9">
          {comment.user?.image ? (
            <AvatarImage
              src={comment.user.image}
              alt={comment.user.name || "?"}
            />
          ) : (
            <AvatarFallback>??</AvatarFallback>
          )}
        </Avatar>
        {/* 본문 */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.user.name}</span>
            <span className="text-xs text-muted-foreground">
              {TimeTransform(comment.createdAt).datetime}
            </span>
            {comment.secretYn && (
              <span className="ml-1 text-xs text-gray-500">🔒 비밀글</span>
            )}
          </div>
          <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed">
            {comment.secretYn
              ? "🔒 작성자와 관리자만 볼 수 있는 글입니다."
              : comment.content}
          </p>
          <div className="flex gap-2">
            <div className="flex gap-2 items-center group ">
              <div className="flex items-center hover:text-blue-500 transition">
                <MessageCircle className="w-4 cursor-pointer" />
                <p className="text-[12px] text-gray-800 flex gap-2 ml-1">
                  {getReplies(comment.id).length}
                  {"개 "}
                </p>
              </div>

              <p className="text-[12px] text-gray-800 flex gap-2 ml-1 hover:text-blue-500">
                {getReplies(comment.id).length > 0 ? (
                  showReply ? (
                    <span onClick={() => setShowReply(!showReply)}>숨기기</span>
                  ) : (
                    <span onClick={() => setShowReply(!showReply)}>더보기</span>
                  )
                ) : (
                  ""
                )}
              </p>

              <div className="flex items-center opacity-0 group-hover:opacity-100 hover:text-blue-500 transition-opacity cursor-pointer">
                <PlusCircle className="w-3 h-3" />
                <p
                  className="text-[12px] text-gray-800 flex gap-2 ml-1"
                  onClick={() => {
                    setShowCommentForm(!showCommentForm);
                  }}
                >
                  {showCommentForm ? "닫기" : "댓글작성"}
                </p>
              </div>

              {/* 수정/삭제: 권한 없으면 렌더링 자체 생략, 권한 있으면 hover 때만 보이게 */}
              {isEditable && (
                <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-red-600 inline-flex items-center gap-1"
                    onClick={() => {
                      delMutate({ blogId, id: comment.id });
                    }}
                    aria-label="댓글 삭제"
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />{" "}
                    {isPending ? "삭제중" : "삭제"}
                  </button>
                </div>
              )}
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
