"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import CategoryMain from "./CategoryMain";
import dynamic from "next/dynamic";
import { useBlogWriteMutation } from "@/hooks/useBlogWriteMutations";
import { Button } from "@/components/ui/button";

// 마크다운 에디터
const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

export default function BlogWriteForm() {
  const editorRef = useRef<Editor>(null);
  const [category, setCategory] = useState("");
  const { register, setValue, getValues, handleSubmit, watch } =
    useForm<BlogForm>({
      defaultValues: { title: "", content: "", tags: [], category: "" },
    });
  watch("tags");
  const { mutate: saveMutation, isPending: savingPending } =
    useBlogWriteMutation();

  useEffect(() => {
    setValue("category", category);
  }, [category, setValue]);

  // 태그 추가 이벤트
  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("키 입력됨");
    const keys = ["Enter", "Tab"];
    if (keys.includes(e.key)) {
      console.log("엔터나 탭 키 입력됨");
      e.preventDefault();
      const newTag = e.currentTarget.value.trim().toLowerCase();
      console.log("newTag : ", newTag);
      const currentTags = getValues("tags");
      if (currentTags.length >= 10) {
        toast.error("태그는 최대 10개까지 추가 가능합니다.");
        return;
      }
      if (newTag && !currentTags.includes(newTag)) {
        console.log("태그 추가하기 전");
        const newTags = [...currentTags, newTag];
        setValue("tags", newTags);
        e.currentTarget.value = "";
        console.log(getValues("tags"));
      }
    }
  };
  // 태그 삭제 이벤트
  const handleTagDelete = (tag: string) => {
    const currentTags = getValues("tags");
    const newTags = currentTags.filter((t) => t != tag);
    setValue("tags", newTags);
  };

  // 폼 제출 이벤트
  const onSubmit = (data: BlogForm) => {
    saveMutation(data);
  };

  return (
    <div className="p-5">
      <form className=" flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <div className="flex">
            <CategoryMain category={category} setCategory={setCategory} />
            <p className="px-3 py-1 rounded-md">
              {new Date().toISOString().slice(0, 10)}
            </p>
          </div>
          <Button type="submit" disabled={savingPending}>
            {savingPending ? "저장중" : "저장"}
          </Button>
        </div>
        <Input placeholder="제목을 입력하세요" {...register("title")} />

        <Input
          type="text"
          placeholder="Enter나 Tab으로 태그 추가"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1"
          onKeyDown={handleTagsKeyDown}
        />

        <div className="flex flex-wrap gap-2 mt-2">
          {getValues("tags").map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-red-300 transition-all"
              onClick={() => handleTagDelete(tag)}
            >
              # {tag}
            </span>
          ))}
        </div>

        <ToastEditor
          ref={editorRef}
          initialValue=" "
          previewStyle="vertical"
          height="600px"
          initialEditType="wysiwyg"
          useCommandShortcut={false}
          onChange={() => {
            const instance = editorRef.current?.getInstance();
            if (instance) {
              setValue("content", instance.getMarkdown());
            }
          }}
        />
      </form>
    </div>
  );
}
