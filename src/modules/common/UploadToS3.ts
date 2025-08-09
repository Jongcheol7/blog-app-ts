import axios from "axios";
import { toast } from "sonner";

export async function UploadToS3(file: File, folder: string) {
  try {
    const { data } = await axios.post("/api/blog/upload/image", {
      fileType: file.type,
      folder,
    });
    if (data.error) {
      toast.error("Presigned URL 생성 실패");
      return null;
    }
    const { uploadUrl, fileUrl } = data;
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return fileUrl;
  } catch (err) {
    toast.error("S3 업로드 중 오류가 발생했습니다. " + err);
    return null;
  }
}
