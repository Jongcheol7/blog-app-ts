"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGuestbookMutation } from "@/hooks/useGuestbookMutation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Prop = {
  content: string;
  secretYn: boolean;
};

export default function GuestbookForm() {
  const { register, setValue, handleSubmit } = useForm<Prop>();
  const { mutate, isPending, isSuccess } = useGuestbookMutation();
  const onSubmit = (data: Prop) => {
    mutate({
      content: data.content,
      secretYn: data.secretYn,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setValue("content", "");
      setValue("secretYn", false);
    }
  }, [isSuccess, setValue]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          {...register("content")}
          placeholder="Write something..."
          className="min-h-[100px] rounded-xl resize-none bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between mt-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              {...register("secretYn")}
              type="checkbox"
              className="accent-primary w-3.5 h-3.5"
            />
            Secret
          </label>
          <Button type="submit" size="sm" className="rounded-lg px-5" disabled={isPending}>
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
