import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  try {
    const details = await prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        blogTags: { include: { tag: true } },
      },
    });

    if (!details || details.deletedAt) {
      return NextResponse.json({ error: "존재하지 않는 글입니다." }, { status: 404 });
    }

    // 비공개 글은 작성자 또는 관리자만 접근 가능
    if (details.privateYn) {
      const session = await getServerSession(authOptions);
      if (details.userId !== session?.user?.id && !session?.user?.isAdmin) {
        return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
      }
    }

    return NextResponse.json({ details });
  } catch (err) {
    console.error("글 상세조회 실패 :", err);
    return NextResponse.json({ error: "글 상세조회 실패" }, { status: 500 });
  }
}
