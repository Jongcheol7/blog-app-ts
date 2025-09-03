"use client";
import { Textarea } from "@/components/ui/textarea";
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
    console.log(data);
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
    <div className="mt-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-1">
          <div className="flex gap-2">
            <p className="text-gray-600 text-sm">비밀글 설정</p>
            <input {...register("secretYn")} type="checkbox" />
          </div>
          <button className="right-1 bottom-1 flex self-center bg-gray-300 text-black px-2 py-1 rounded-sm font-bold text-sm cursor-pointer hover:bg-green-600 transition">
            {isPending ? "등록중" : "등록"}
          </button>
        </div>
        <Textarea {...register("content")} placeholder="내용을 입력하세요" />
      </form>
    </div>
  );
}
