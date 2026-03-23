"use client";

import CommentItem from "./CommentItem";
import { useCommentLists } from "@/hooks/useCommentLists";
import { MessageCircle } from "lucide-react";

type Props = {
  blogId: number;
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    imageUrl: string;
  };
  parentId: number | null;
};

export default function CommentLists({ blogId }: Props) {
  const { data } = useCommentLists(blogId);

  const allComments = data?.pages.flatMap((page) => {
    return page.comments;
  });

  const parentComments = data?.pages.flatMap((page) => {
    return page.comments.filter(
      (comment: Comment) => comment.parentId === null
    );
  });

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Comments{" "}
          {allComments && allComments.length > 0 && (
            <span className="text-muted-foreground font-normal text-sm">
              ({allComments.length})
            </span>
          )}
        </h3>
      </div>
      <div className="space-y-1">
        {parentComments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={allComments ?? []}
            depth={0}
            blogId={blogId}
          />
        ))}
      </div>
    </div>
  );
}
