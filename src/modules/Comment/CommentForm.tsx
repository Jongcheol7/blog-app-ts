"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  const { data: session } = useSession();

  const onSubmit = (data: FormData) => {
    if (!data.content.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

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
    <div className="mt-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          {...register("content")}
          placeholder={session?.user ? "Write a comment..." : "Login to comment"}
          className="min-h-[100px] rounded-xl resize-none bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground"
          readOnly={!session?.user}
          onFocus={() => {
            if (!session?.user) {
              toast.error("Please login to comment.");
            }
          }}
        />
        {session?.user && (
          <div className="flex justify-end items-center gap-3 mt-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary w-3.5 h-3.5"
                {...register("secretYn")}
              />
              Secret
            </label>
            <Button
              type="submit"
              size="sm"
              className="rounded-lg px-5"
              disabled={isCommenting}
            >
              {isCommenting ? "Posting..." : "Post"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
