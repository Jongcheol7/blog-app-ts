import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const { fileType, folder } = await request.json();
  if (!fileType) {
    return NextResponse.json({ error: "fileType is empty" }, { status: 400 });
  }
  const ext = fileType?.split("/")[1] || "jpg";

  const fileName = `blog/${folder}/${Date.now()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return NextResponse.json({
    uploadUrl: signedUrl,
    //fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    fileUrl: `${process.env.CLOUDFRONT_DOMAIN_NAME}/${fileName}`,
  });
}
