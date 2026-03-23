"use client";

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
  Code2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useFileHandler } from "@/hooks/useFileHandler";
import { Separator } from "@/components/ui/separator";

type Prop = {
  editor: TiptapEditor;
};

const FONT_SIZES = ["14px", "16px", "20px", "24px", "28px", "32px"];
const COLOR_PALETTE = [
  "#000000",
  "#e11d48",
  "#f97316",
  "#eab308",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

const toolBtnClass =
  "p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer";

export default function NoteToolbar({ editor }: Prop) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isAlignOpen, setIsAlignOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const { handleImageSelect, handleVideoSelect } = useFileHandler(editor);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setIsFontSizeOpen(false);
        setIsAlignOpen(false);
        setIsColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handerFile = async (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (type === "image") {
        await handleImageSelect(file);
      } else if (type === "video") {
        await handleVideoSelect(file);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div
      ref={toolbarRef}
      className="w-full mx-auto bg-secondary/80 backdrop-blur-sm border border-border rounded-2xl px-3 py-2.5 flex items-center gap-1"
    >
      {/* Font size */}
      <div className="relative">
        <button
          type="button"
          className={toolBtnClass}
          onClick={() => {
            setIsFontSizeOpen((prev) => !prev);
            setIsAlignOpen(false);
            setIsColorOpen(false);
          }}
        >
          <Type className="w-4 h-4" />
        </button>
        {isFontSizeOpen && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl shadow-lg flex flex-col z-50 text-sm overflow-hidden">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setFontSize(size).run();
                  }, 0);
                  setIsFontSizeOpen(false);
                }}
                className="px-4 py-2 hover:bg-accent text-foreground transition-colors"
              >
                {size.replace("px", "")}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bold */}
      <button
        type="button"
        className={toolBtnClass}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Align */}
      <div className="relative">
        <button
          type="button"
          className={toolBtnClass}
          onClick={() => {
            setIsFontSizeOpen(false);
            setIsAlignOpen((prev) => !prev);
            setIsColorOpen(false);
          }}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        {isAlignOpen && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl shadow-lg flex gap-1 p-2 z-50">
            <button
              className={toolBtnClass}
              onClick={() => {
                setTimeout(() => {
                  editor.chain().focus().setTextAlign("left").run();
                }, 0);
                setIsAlignOpen(false);
              }}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              className={toolBtnClass}
              onClick={() => {
                setTimeout(() => {
                  editor.chain().focus().setTextAlign("center").run();
                }, 0);
                setIsAlignOpen(false);
              }}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              className={toolBtnClass}
              onClick={() => {
                setTimeout(() => {
                  editor.chain().focus().setTextAlign("right").run();
                }, 0);
                setIsAlignOpen(false);
              }}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Image */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={(e) => handerFile("image", e)}
      />
      <button
        type="button"
        className={toolBtnClass}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagePlus className="w-4 h-4" />
      </button>

      {/* Video */}
      <input
        type="file"
        accept="video/*"
        hidden
        ref={videoInputRef}
        onChange={(e) => handerFile("video", e)}
      />
      <button
        type="button"
        className={toolBtnClass}
        onClick={() => videoInputRef.current?.click()}
      >
        <Video className="w-4 h-4" />
      </button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Code block */}
      <button
        type="button"
        className={toolBtnClass}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
      >
        <Code2 className="w-4 h-4" />
      </button>

      {/* List */}
      <button
        type="button"
        className={toolBtnClass}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </button>

      {/* Task list */}
      <button
        type="button"
        className={toolBtnClass}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <SquareCheckBig className="w-4 h-4" />
      </button>

      {/* Emoji */}
      <button
        type="button"
        className={toolBtnClass}
        onClick={() => editor.chain().focus().insertContent("📝").run()}
      >
        <Smile className="w-4 h-4" />
      </button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Color */}
      <div className="relative">
        <button
          type="button"
          className={toolBtnClass}
          onClick={() => {
            setIsFontSizeOpen(false);
            setIsAlignOpen(false);
            setIsColorOpen((prev) => !prev);
          }}
        >
          <Paintbrush className="w-4 h-4" />
        </button>
        {isColorOpen && (
          <div className="absolute bottom-full mb-2 right-0 bg-popover border border-border rounded-xl shadow-lg p-2.5 z-50 flex gap-1.5">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setTimeout(() => {
                    editor.chain().focus().setColor(color).run();
                  }, 0);
                  setIsColorOpen(false);
                }}
                className="w-7 h-7 rounded-full border-2 border-transparent hover:border-foreground/30 transition-colors cursor-pointer"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
