import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit"));

  console.log("BlogLists cursor : ", cursor);
  console.log("BlogLists limit : ", limit);

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인 정보가 없습니다.");
    return NextResponse.json(
      { error: "로그인 정보가 없습니다." },
      { status: 401 }
    );
  }

  try {
    // 첫페이지일때
    if (!cursor) {
      const pinned = await prisma.blog.findFirst({
        where: { deletedAt: null, pinnedYn: true },
        orderBy: { id: "desc" },
      });
      const result = await prisma.blog.findMany({
        where: { deletedAt: null, pinnedYn: false },
        orderBy: { id: "desc" },
        take: limit,
      });
      const nextCursor =
        result.length > 0 ? String(result[result.length - 1].id) : null;
      return NextResponse.json({ pinned, result, nextCursor });
    } else {
      // 그 다음 페이지부터
      const result = await prisma.blog.findMany({
        where: { deletedAt: null, pinnedYn: false },
        orderBy: { id: "desc" },
        cursor: { id: Number(cursor) },
        skip: 1,
        take: limit,
      });
      const nextCursor =
        result.length > 0 ? String(result[result.length - 1].id) : null;
      return NextResponse.json({ pinned: null, result, nextCursor });
    }
  } catch (err) {
    console.error("블로그 조회에 실패했습니다." + err);
    return NextResponse.json(
      { error: "블로그 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
