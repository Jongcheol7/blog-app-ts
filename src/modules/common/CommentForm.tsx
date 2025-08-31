import { Textarea } from "@/components/ui/textarea";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { useForm } from "react-hook-form";

type FormData = {
  content: string;
};
type Prop = {
  postId: number;
  parentId?: number | null;
};

export default function CommentForm({ postId, parentId = null }: Prop) {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const {
    mutate: saveCommentMutate,
    isPending: isCommenting,
    isSuccess,
  } = useCommentMutation();

  const onSubmit = (data: FormData) => {
    saveCommentMutate({
      postId: postId,
      content: data.content,
      parentId: parentId,
    });
  };

  if (isSuccess) {
    setValue("content", "");
  }

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-1 relative">
          <Textarea
            {...register("content")}
            placeholder="댓글을 입력하세요"
            className="flex-1 pr-12"
          />
          <button className="absolute right-1 bottom-1 flex self-center bg-gray-300 text-black px-3 py-2 rounded-sm font-bold text-sm cursor-pointer hover:bg-green-600 transition">
            {isCommenting ? "등록중" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
