"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import CategoryMain from "./CategoryMain";
import dynamic from "next/dynamic";

// 마크다운 에디터
const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

export default function BlogWriteForm() {
  const editorRef = useRef<Editor>(null);
  const { register, setValue, getValues, handleSubmit, watch } =
    useForm<BlogForm>({
      defaultValues: { title: "", content: "", tags: [] },
    });
  watch("tags");

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

  return (
    <div className="p-5 flex flex-col gap-2">
      <CategoryMain />

      <Input placeholder="제목을 입력하세요" {...register("title")} />

      <p className="border px-3 py-1 rounded-md">2025.08.06</p>

      <Input
        type="text"
        placeholder="Enter나 Tab으로 태그 추가"
        className="w-full border border-gray-300 rounded px-3 mt-2 py-2 focus:outline-none focus:ring-1"
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
        initialValue=""
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={false}
      />
    </div>
  );
}
