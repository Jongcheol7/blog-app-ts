"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentForm from "./CommentForm";
import { MessageCircle, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { TimeTransform } from "../common/TimeTransform";
import { useSession } from "next-auth/react";
import { useCommentDeleteMutation } from "@/hooks/useCommentMutation";
import { cn } from "@/lib/utils";

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
  const { mutate: delMutate, isPending } = useCommentDeleteMutation();

  const isAdmin = session?.user.isAdmin;
  const isOwner = String(session?.user.id) === String(comment.user.id);
  const isEditable = isAdmin || isOwner;

  const getReplies = (id: number) => {
    return replies.filter((c) => c.parentId === id);
  };
  const nextDepth = depth + 1;
  const replyCount = getReplies(comment.id).length;

  return (
    <div
      className={cn(
        "mb-2",
        depth > 0 && "border-l-2 border-primary/15 ml-4 pl-4"
      )}
    >
      {/* Comment */}
      <div className="flex items-start gap-3 py-3 rounded-lg transition-colors hover:bg-accent/50 -mx-2 px-2 group">
        <Avatar className="h-8 w-8 ring-2 ring-background shrink-0">
          {comment.user?.image ? (
            <AvatarImage
              src={comment.user.image}
              alt={comment.user.name || "?"}
            />
          ) : (
            <AvatarFallback className="text-xs">
              {comment.user.name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">
              {comment.user.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {TimeTransform(comment.createdAt).datetime}
            </span>
            {comment.secretYn && (
              <span className="text-xs text-muted-foreground">Secret</span>
            )}
          </div>

          <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
            {comment.secretYn
              ? "This comment is only visible to the author and admin."
              : comment.content}
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {/* Reply count */}
            <button
              type="button"
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              onClick={() => replyCount > 0 && setShowReply(!showReply)}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{replyCount}</span>
              {replyCount > 0 && (
                <span className="ml-1">
                  {showReply ? "Hide" : "Show"}
                </span>
              )}
            </button>

            {/* Write reply */}
            <button
              type="button"
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:text-primary transition-all cursor-pointer"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{showCommentForm ? "Cancel" : "Reply"}</span>
            </button>

            {/* Delete */}
            {isEditable && (
              <button
                type="button"
                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all cursor-pointer ml-auto"
                onClick={() => delMutate({ blogId, id: comment.id })}
                disabled={isPending}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isPending ? "Deleting..." : "Delete"}</span>
              </button>
            )}
          </div>

          {showCommentForm && (
            <CommentForm blogId={blogId} parentId={comment.id} />
          )}
        </div>
      </div>

      {/* Replies */}
      {showReply && replyCount > 0 && (
        <div>
          {getReplies(comment.id).map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={replies}
              depth={nextDepth}
              blogId={blogId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
