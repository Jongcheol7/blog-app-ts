import { ResizeImageIfNeeded } from "@/modules/common/ResizeImageIfNeeded";
import { useVideoStore } from "@/store/useVideoStore";
import type { Editor as TiptapEditor } from "@tiptap/react";

export function useFileHandler(editor: TiptapEditor) {
  const { addFile } = useVideoStore();

  // 이미지
  const handleImageSelect = async (file: File) => {
    const MAX_IMAGES = 20;
    const MAX_FILE_SIZE_MB = 3;
    const MAX_IMAGE_WIDTH = 1200;

    // 1.파일 크기 체크
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`이미지 크기는 ${MAX_FILE_SIZE_MB}MB 이하만 가능합니다.`);
    }

    // 2.현재 에디터에 삽입된 이미지 갯수세기
    const currentImageCount = (
      editor.getHTML().match(/<img[^>]*src="data:image\/[^;]*;base64[^>]*>/g) ||
      []
    ).length;
    if (currentImageCount >= MAX_IMAGES) {
      throw new Error(`이미지는 최대 ${MAX_IMAGES}개까지 첨부 가능합니다.`);
    }

    // 3.파일 base64변경 및 리사이즈
    const base64 = await fileToBase64(file);
    const resized = await ResizeImageIfNeeded(base64, MAX_IMAGE_WIDTH);

    // 4.에디터에 삽입
    editor.commands.insertContent({
      type: "resizableImage",
      attrs: { src: resized },
    });
  };

  // 비디오
  const handleVideoSelect = async (file: File) => {
    const MAX_VIDEO_SIZE_MB = 1024;
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      throw new Error(`영상 크기는 ${MAX_VIDEO_SIZE_MB}MB 이하만 가능합니다.`);
    }

    const tempId = `__TEMP_VIDEO_${Date.now()}__`;
    addFile(tempId, file);
    editor.commands.insertMuxVideo(tempId);
  };

  return { handleImageSelect, handleVideoSelect };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("파일을 읽지 못했습니다.");
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
