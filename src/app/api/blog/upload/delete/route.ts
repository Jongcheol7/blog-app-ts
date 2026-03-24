import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { r2Client, R2_BUCKET } from "@/lib/r2";

export async function POST(request: Request) {
  const { imageUrl, folder } = await request.json();
  console.log("삭제할 imageUrl ", imageUrl);
  const s3Key = `blog/${folder}/` + imageUrl.split("/").pop();
  console.log("추출된 s3 key : ", s3Key);

  try {
    if (s3Key) {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET,
          Key: s3Key,
        })
      );
    }
    return NextResponse.json({ success: "사진 삭제 성공" }, { status: 200 });
  } catch (err) {
    console.log("R2 삭제 실패:", err);
    return NextResponse.json({ error: "사진 삭제 실패" }, { status: 500 });
  }
}
