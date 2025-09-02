import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { blogId, content, parentId } = await request.json();
  console.log("댓글저장 blogId :", blogId);
  console.log("댓글저장 content :", content);
  console.log("댓글저장 parentId :", parentId);
  if (!blogId) {
    console.error("Comment 저장시 blogId 찾을수 없습니다.");
    return NextResponse.json(
      { error: "Comment 저장시 blogId 찾을수 없습니다." },
      { status: 400 }
    );
  }
  if (!content || content.trim() === "") {
    console.error("Comment  저장시 content 내용이 없습니다.");
    return NextResponse.json(
      { error: "Comment  저장시 content 내용이 없습니다." },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.error("로그인 정보가 없습니다.");
    return NextResponse.json(
      { error: "로그인 정보가 없습니다." },
      { status: 401 }
    );
  }

  try {
    await prisma.comment.create({
      data: {
        userId: session.user.id,
        blogId,
        content: content.trim(),
        parentId: parentId || null,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Comment 저장에 실패했습니다 :", err);
    return NextResponse.json(
      { error: "Comment 저장에 실패했습니다" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blogId = Number(searchParams.get("blogId"));
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit") || 10);
  console.log("댓글조회 blogId : ", blogId);
  console.log("댓글조회 cursor : ", cursor);
  console.log("댓글조회 limit : ", limit);

  if (!blogId) {
    console.error("댓글 조회에서 blogId 가 없습니다.");
    return NextResponse.json(
      { error: "댓글 조회에서 blogId 가 없습니다." },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
      },
      include: {
        user: true,
      },
      take: limit,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      skip: cursor ? 1 : 0,
    });
    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1].id : null;
    return NextResponse.json({ comments: comments, nextCursor: nextCursor });
  } catch (err) {
    console.error("댓글 조회에 실패했습니다.", err);
    return NextResponse.json(
      { error: "댓글 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}
