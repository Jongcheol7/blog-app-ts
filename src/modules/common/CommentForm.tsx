"use client";
import { Textarea } from "@/components/ui/textarea";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  content: string;
  secretYn: boolean;
};
type Prop = {
  blogId: number;
  parentId?: number | null;
};

export default function CommentForm({ blogId, parentId = null }: Prop) {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const {
    mutate: saveCommentMutate,
    isPending: isCommenting,
    isSuccess,
  } = useCommentMutation();

  const onSubmit = (data: FormData) => {
    saveCommentMutate({
      blogId,
      content: data.content,
      secretYn: data.secretYn,
      parentId: parentId,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setValue("content", "");
    }
  }, [isSuccess, setValue]);

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-1 relative">
          <Textarea
            {...register("content")}
            placeholder="댓글을 입력하세요"
            className="flex-1 pr-12"
          />
          <div className="absolute right-1 top-0 flex gap-1">
            <label htmlFor="secretYn" className="text-gray-500 text-[12px]">
              비밀댓글
            </label>
            <input type="checkbox" id="secretYn" {...register("secretYn")} />
          </div>
          <button className="absolute right-1 bottom-1 flex self-center bg-gray-300 text-black px-3 py-2 rounded-sm font-bold text-sm cursor-pointer hover:bg-green-600 transition">
            {isCommenting ? "등록중" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
