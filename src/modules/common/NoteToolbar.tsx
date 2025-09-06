"use client";

import { ResizeImageIfNeeded } from "./ResizeImageIfNeeded";
import {
  Bold,
  List,
  Smile,
  ImagePlus,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SquareCheckBig,
  Type,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { useVideoStore } from "@/store/useVideoStore";

type Prop = {
  editor: TiptapEditor;
};

const FONT_SIZES = ["14px", "16px", "20px", "24px", "28px", "32px"];
const COLOR_PALETTE = [
  "#000000", // black
  "#e11d48", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#10b981", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#6b7280", // gray
];

export default function NoteToolbar({ editor }: Prop) {
  const fileInputRef = useRef<Record<string, File>>(null);
  const videoInputRef = useRef<Record<string, File>>(null);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const toolbarRef = useRef(null);
  const { addFile } = useVideoStore();

  // ✅ 바깥 클릭 감지 → 모든 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setIsFontSizeOpen(false);
        setIsAlignOpen(false);
        setIsColorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 사진 파일 첨부 메서드
  const MAX_IMAGES = 20; //글당 최대 이미지 갯수 제한 2개
  const MAX_FILE_SIZE_MB = 3; // 개별 이미지 최대 허용 파일 크기 (MB) - 이 용량을 넘으면 경고 후 처리 중단
  const MAX_IMAGE_WIDTH = 1200; // 최대 이미지 너비 (픽셀) - 이 너비를 넘으면 리사이징
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //if (session?.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    //  alert("관리자만 이미지를 업로드할 수 있습니다.");
    //  fileInputRef.current.value = "";
    //  return;
    //}

    // 1. 파일 크기 검사
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`이미지 크기는 ${MAX_FILE_SIZE_MB}MB 이하만 가능합니다.`);
      fileInputRef.current.value = "";
      return;
    }

    // 2. 현재 에디터에 삽입된 base64 이미지 개수 세기
    const currentImageCount = (
      editor.getHTML().match(/<img[^>]*src="data:image\/[^;]*;base64[^>]*>/g) ||
      []
    ).length;

    if (currentImageCount >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지만 첨부할 수 있습니다.`);
      fileInputRef.current.value = "";
      return;
    }

    // 3. FileReader로 base64 변환 → 에디터 삽입
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result;

      // ⛔ 너무 큰 경우 → 리사이징
      const resizedBase64 = await ResizeImageIfNeeded(base64, MAX_IMAGE_WIDTH);

      // ✅ 에디터에 base64 이미지 삽입
      editor.commands.insertContent({
        type: "resizableImage",
        attrs: {
          src: resizedBase64,
        },
      });
    };

    reader.readAsDataURL(file);
  };

  // 임시 파일 저장소 (저장 시 실제 Mux 업로드에 쓰일 예정)
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("ddd file : ", file);
    if (!file) return;

    const MAX_VIDEO_SIZE_MB = 1024;
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      alert(`영상 크기는 ${MAX_VIDEO_SIZE_MB}MB 이하만 가능합니다.`);
      return;
    }

    // placeholder ID 만들기 (파일명 + 타임스탬프 조합)
    const tempId = `__TEMP_VIDEO_${Date.now()}__`;
    console.log("ddd tempId : ", tempId);

    // Zustand 스토어에 저장
    addFile(tempId, file);

    // 에디터에 placeholder muxVideo 삽입
    editor.commands.insertMuxVideo(tempId);
    console.log("editor.getHTML() : ", editor.getHTML());

    // input 초기화 (같은 파일 다시 선택할 수 있게)
    e.target.value = "";
  };
  return (
    <>
      {/* 기본 툴바 */}
      <div
        ref={toolbarRef}
        className={`w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl  mx-auto bg-white border border-gray-300 rounded-xl px-4 py-2  flex justify-around items-center
          `}
      >
        {/* 글자크기 토글 */}
        <div className="relative">
          <Type
            className="w-5 h-5 cursor-pointer hover:text-red-700"
            onClick={() => {
              setIsFontSizeOpen((prev) => !prev);
              setIsAlignOpen(false);
              setIsColorOpen(false);
            }}
          />

          {isFontSizeOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded shadow-md flex flex-col z-50 text-sm">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    //editor.chain().focus().setFontSize(size).run();
                    setTimeout(() => {
                      editor.chain().focus().setFontSize(size).run();
                    }, 0);
                    setIsFontSizeOpen(false);
                  }}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  {size.replace("px", "")}px
                </button>
              ))}
            </div>
          )}
        </div>
        {/* 두껍게 버튼 */}
        <Bold
          className="w-5 h-5  cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        {/* ✅ 정렬 토글 */}
        <div className="relative">
          <AlignCenter
            className="w-5 h-5 cursor-pointer hover:text-red-700"
            onClick={() => {
              setIsFontSizeOpen(false);
              setIsAlignOpen((prev) => !prev);
              setIsColorOpen(false);
            }}
          />

          {isAlignOpen && (
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded shadow-md flex gap-2 p-3 z-50">
              <AlignLeft
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setTextAlign("left").run();
                  }, 0);
                  setIsAlignOpen(false);
                }}
              />
              <AlignCenter
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setTextAlign("center").run();
                  }, 0);
                  setIsAlignOpen(false);
                }}
              />
              <AlignRight
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setTextAlign("right").run();
                  }, 0);
                  setIsAlignOpen(false);
                }}
              />
            </div>
          )}
        </div>
        {/* 이미지 업로드 버튼 */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        <ImagePlus
          className="w-5 h-5 cursor-pointer hover:text-red-700"
          onClick={() => fileInputRef.current?.click()}
        />
        {/* 비디오 업로드 버튼 */}
        <input
          type="file"
          accept="video/*"
          hidden
          ref={videoInputRef}
          onChange={handleVideoSelect}
        />
        <Video
          className="w-5 h-5 cursor-pointer hover:text-red-700"
          onClick={() => videoInputRef.current?.click()}
        />
        {/* 리스트 버튼 */}
        <List
          className="w-5 h-5  cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        {/* To-Do 버튼 */}
        <SquareCheckBig
          className="w-5 h-5  cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        />
        {/* 이모티콘 버튼 */}
        <Smile
          className={`w-5 h-5 cursor-pointer hover:text-red-700`}
          onClick={() => editor.chain().focus().insertContent("📝").run()}
        />
        {/* 글자색 버튼 */}
        <div className="relative">
          {/* 색상 토글 아이콘 */}
          <Paintbrush
            className={`w-5 h-5 cursor-pointer hover:text-red-700 ${
              isColorOpen ? "text-red-700" : ""
            }`}
            onClick={() => {
              setIsFontSizeOpen(false);
              setIsAlignOpen(false);
              setIsColorOpen((prev) => !prev);
            }}
          />

          {/* 색상 팔레트 */}
          {isColorOpen && (
            <div className="absolute bottom-full mb-2 right-[-20px] bg-white border border-gray-300 rounded shadow-md p-2 z-50 flex gap-1">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setTimeout(() => {
                      editor.chain().focus().setColor(color).run();
                    }, 0);
                    setIsColorOpen(false);
                  }}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
