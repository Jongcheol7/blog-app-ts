import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST() {
  try {
    const envPrefix = process.env.NODE_ENV === "production" ? "prod" : "dev";
    const upload = await mux.video.uploads.create({
      cors_origin: process.env.NEXTAUTH_URL as string,
      new_asset_settings: {
        playback_policies: ["public"],
        passthrough: `${envPrefix}-blog`,
      },
    });
    return NextResponse.json({ url: upload.url, id: upload.id });
  } catch (err) {
    console.error("Mux Upload Url 생성 오류 : ", err);
    return NextResponse.json(
      { error: "Mux Upload Url 생성 오류" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uploadId = searchParams.get("uploadId");

  if (!uploadId) {
    console.error("uploadId 가 없습니다.");
    return NextResponse.json({ error: "uploadId 없음" }, { status: 400 });
  }

  try {
    const upload = await mux.video.uploads.retrieve(uploadId);
    if (!upload.asset_id) {
      return NextResponse.json(
        { error: "Mux에서 영상을 찾을수 없습니다." },
        { status: 500 }
      );
    }
    const asset = await mux.video.assets.retrieve(upload.asset_id);
    return NextResponse.json({
      asset_id: upload.asset_id,
      playback_id: asset.playback_ids?.[0]?.id ?? null,
    });
  } catch (err) {
    console.error("Mux 상태 확인 오류:", err);
    return NextResponse.json({ error: "Mux 상태 확인 오류" }, { status: 500 });
  }
}
