"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
import { ResizableImage } from "./ResizableImage";
import { toast } from "sonner";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import NoteToolbar from "./NoteToolbar";
import imageCompression from "browser-image-compression";
import { MuxVideo } from "./MuxVideo";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";

import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import java from "highlight.js/lib/languages/java";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("java", java);

export default function Editor({ setEditor, content, readOnly }: EditorType) {
  const safeHTML = DOMPurify.sanitize(content, {
    ADD_TAGS: ["mux-player"],
    ADD_ATTR: ["playback-id", "stream-type", "metadata-video-title"],
  });
  const prevImgsRef = useRef<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      ResizableImage,
      TextStyle,
      Color,
      MuxVideo,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    immediatelyRender: false,
    content: "",
    editable: !readOnly,
    autofocus: false,
    async onUpdate({ editor }) {
      const html = editor.getHTML();

      const currentImgs = [
        ...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g),
      ].map((m) => m[1]);

      const deletedImgs = prevImgsRef.current.filter(
        (src) => !currentImgs.includes(src)
      );
      const addedImgs = currentImgs.filter(
        (src) => !prevImgsRef.current.includes(src)
      );

      deletedImgs.forEach((src: string) => {
        if (
          src.startsWith(process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME ?? "")
        ) {
          fetch("/api/notes/image", {
            method: "POST",
            body: JSON.stringify({ imageUrl: src }),
            headers: { "Content-Type": "application/json" },
          });
        }
      });

      prevImgsRef.current = currentImgs;

      for (let i = 0; i < addedImgs.length; i++) {
        if (
          addedImgs[i].startsWith("data:") &&
          !addedImgs[i].includes("compressed")
        ) {
          try {
            const res = await fetch(addedImgs[i]);
            const blob = await res.blob();
            const file = new File([blob], `image${i}.jpeg`, {
              type: blob.type,
            });
            const compressionOption = {
              maxSizeMB: 2,
              maxWidthOrHeight: 1024,
              useWebWorker: true,
            };
            const compressed = await imageCompression(file, compressionOption);
            const compressedUrl = URL.createObjectURL(compressed);
            const newHtml = html.replace(
              addedImgs[i],
              `${compressedUrl}" data-compressed="true`
            );
            editor.commands.setContent(newHtml, { emitUpdate: false });

            const replacedImgs = [
              ...newHtml.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g),
            ].map((m) => m[1]);
            prevImgsRef.current = replacedImgs;
          } catch (err) {
            console.error("Image compression failed:", err);
            toast.error("Image compression error.");
          }
        }
      }
    },
  });

  useEffect(() => {
    if (editor && setEditor) {
      setEditor(editor);

      Promise.resolve().then(() => {
        editor.commands.setContent(safeHTML);
      });

      const initImgs = [
        ...safeHTML.matchAll(/src="([^"]+\.(jpeg|jpg|png|webp|gif))"/gi),
      ].map((m) => m[1]);
      prevImgsRef.current = initImgs;
    }
  }, [editor, setEditor, safeHTML]);

  if (!editor) return null;

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className={`tiptap w-full overflow-y-auto scrollbar-thin ${
          readOnly ? "h-full" : "h-[400px]"
        }`}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y")) {
            e.preventDefault();
            toast.error("Ctrl+Z / Ctrl+Y is disabled.");
          }
        }}
      />
      {!readOnly && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-3 pb-1">
          <NoteToolbar editor={editor} />
        </div>
      )}
    </div>
  );
}
