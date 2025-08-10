import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit"));

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인 정보가 없습니다.");
    return NextResponse.json(
      { error: "로그인 정보가 없습니다." },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.blog.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      cursor: cursor ? { id: Number(cursor) } : undefined,
      skip: cursor ? 1 : 0,
      take: limit,
    });
    return NextResponse.json({ result });
  } catch (err) {
    console.error("블로그 조회에 실패했습니다." + err);
    return NextResponse.json(
      { error: "블로그 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
