import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { r2Client, R2_BUCKET } from "@/lib/r2";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function POST(request: Request) {
  const { fileType, folder } = await request.json();
  if (!fileType) {
    return NextResponse.json({ error: "fileType is empty" }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return NextResponse.json(
      { error: "허용되지 않는 파일 형식입니다." },
      { status: 400 }
    );
  }
  const ext = fileType.split("/")[1] || "jpg";

  const envPrefix = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const fileName = `blog/${envPrefix}/${folder}/${Date.now()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: fileName,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });

  return NextResponse.json({
    uploadUrl: signedUrl,
    fileUrl: `${process.env.R2_PUBLIC_URL}/${fileName}`,
  });
}
