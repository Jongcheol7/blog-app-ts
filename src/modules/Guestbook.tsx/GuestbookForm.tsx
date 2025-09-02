"use client";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

export default function GuestbookForm() {
  const { register, setValue, handleSubmit } = useForm();
  const onSubmit = () => {};

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea {...register("content")} placeholder="내용을 입력하세요" />
      </form>
    </div>
  );
}
