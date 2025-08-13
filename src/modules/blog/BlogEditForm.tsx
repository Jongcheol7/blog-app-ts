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
import imageCompression from "browser-image-compression";
import ImagePicker from "../common/ImagePicker";
import { UploadToS3 } from "../common/UploadToS3";
import { useBlogDetails } from "@/hooks/useBlogDetails";

// 마크다운 에디터
const ToastEditor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

export default function BlogEditForm({ id }: { id: string }) {
  debugger;
  const editorRef = useRef<Editor>(null);
  const [initalContent, setInitialContent] = useState<string>("");
  const [category, setCategory] = useState("");
  const [pickedImage, setPickedImage] = useState<File | null | string>(null);
  const { data } = useBlogDetails(Number(id));
  const { register, setValue, getValues, handleSubmit, watch, reset } =
    useForm<BlogForm>({
      defaultValues: {
        id: 0,
        title: "",
        content: "",
        tags: [],
        category: "",
        imageUrl: "",
        privateYn: false,
      },
    });
  watch("tags");
  const { mutate: saveMutation, isPending: savingPending } =
    useBlogWriteMutation();

  useEffect(() => {
    console.log("category : ", category);
    setValue("category", category);
  }, [category, setValue]);

  useEffect(() => {
    debugger;
    if (!data) return;
    console.log("조회 data : ", data);
    reset({
      id: data.details.id ?? 0,
      title: data.details.title ?? "",
      tags: data.details.blogTags.map(
        (bt: { tag: { name: string } }) => bt.tag.name
      ),
      privateYn: !!data.details.privateYn,
      category: String(data.details.categoryId ?? ""),
    });
    setPickedImage(data.details.imageUrl);
    setInitialContent(data.details.content ?? "");
  }, [data, reset]);

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
  const onSubmit = async (data: BlogForm) => {
    if (!getValues("title") || getValues("title").trim().length === 0) {
      toast.error("글 제목이 없습니다.");
      return false;
    }
    if (!getValues("category") || getValues("category").trim().length === 0) {
      toast.error("글 카테고리가 없습니다.");
      return false;
    }

    data.title = getValues("title");
    data.category = getValues("category");
    console.log("data : ", data);

    const html = editorRef.current?.getInstance().getHTML();
    if (!html || html.trim().length === 0) {
      toast.error("글 내용이 없습니다.");
      return false;
    }

    // 썸네일을 S3에 넣는 작업 해보자.
    // presigned URL 요청 + S3 업로드
    console.log("edit form 에서 저장할 img : ", pickedImage);
    console.log("edit form 에서 저장할 img type: ", typeof pickedImage);
    if (pickedImage) {
      if (typeof pickedImage === "string") {
        setValue("imageUrl", pickedImage);
      } else {
        const fileUrl = await UploadToS3(pickedImage, "thumbnail");
        console.log("S3 presigned fileUrl : ", fileUrl);
        if (!fileUrl) return false;
        setValue("imageUrl", fileUrl);
        data.imageUrl = fileUrl;
      }
    } else {
      toast.error("썸네일은 필수입니다.");
      return false;
    }

    let uploadHtml = html;
    // data: 또는 blob: 모두 매칭
    const matches = [
      ...html.matchAll(
        /<img[^>]+src="((?:data:image\/[^"]+|blob:[^"]+))"[^>]*>/g
      ),
    ];

    console.log("matches :", matches);
    for (let i = 0; i < matches.length; i++) {
      const fullTag = matches[i][0]; //"<img src=\"blob:http://localhost:3000/cd71e97a-a35d-453

      //blob url 추출
      const src = matches[i][1]; //"blob:http://localhost:3000/cd71e97a-a35d-4535-85f0-9d3fe6c4efef"

      // blob url을 Blob 객체로 바꾸자.
      const res = await fetch(src);
      const blobData = await res.blob();

      // Blob 객체를 File 로 바꾸자.
      const file = new File([blobData], "image.jpg", { type: blobData.type });

      // presigned URL 요청 + S3 업로드
      const fileUrl = await UploadToS3(file, "content");
      if (!fileUrl) return false;

      // 기존 url 자리에 S3 presigned URL 로 바꾸기.
      const replaceTag = fullTag.replace(src, fileUrl);
      uploadHtml = uploadHtml.replace(fullTag, replaceTag);
    }

    // 노트 저장.
    saveMutation({
      ...data,
      content: uploadHtml,
    });
  };

  return (
    <div className="p-5">
      <form className=" flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <div className="flex flex-1">
            <CategoryMain
              category={category}
              setCategory={setCategory}
              readYn={false}
            />
            <div className="flex items-center ml-5">
              <label htmlFor="privateYn" className="w-[100px] text-gray-600">
                비밀글 설정
              </label>
              <input
                id="privateYn"
                type="checkbox"
                {...register("privateYn")}
              />
            </div>
          </div>
          <Button type="submit" disabled={savingPending}>
            {savingPending ? "저장중" : "저장"}
          </Button>
        </div>
        <Input placeholder="제목을 입력하세요" {...register("title")} />

        {/* 썸네일 */}
        <ImagePicker
          pickedImage={pickedImage}
          setPickedImage={setPickedImage}
        />

        <div className="flex flex-col flex-1">
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
        </div>

        <ToastEditor
          ref={editorRef}
          initialValue={initalContent ?? " "}
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
          hooks={{
            addImageBlobHook: async (
              blob: File,
              callback: (url: string, altText: string) => void
            ) => {
              console.log("blob :", blob);
              console.log("cablback :", callback);
              // 압축 옵션을 설정해보자.
              const compressionOption = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
              };
              // 이미지를 압축해보자.
              const compressedBlob = await imageCompression(
                blob,
                compressionOption
              );
              const tempSrc = URL.createObjectURL(compressedBlob);
              callback(tempSrc, compressedBlob.name);
            },
          }}
        />
      </form>
    </div>
  );
}
