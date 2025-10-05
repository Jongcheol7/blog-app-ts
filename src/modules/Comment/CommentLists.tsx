//import { useState } from "react";
import CommentItem from "./CommentItem";
import { useCommentLists } from "@/hooks/useCommentLists";

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

  console.log("PostCommentLists. data : ", data);

  //모든 댓글을 모아보자.
  const allComments = data?.pages.flatMap((page) => {
    return page.comments;
  });

  //부모 댓글만 모아보자.
  const parentComments = data?.pages.flatMap((page) => {
    return page.comments.filter(
      (comment: Comment) => comment.parentId === null
    );
  });

  return (
    <div>
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
  );
}
