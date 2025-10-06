import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { blogId, content, parentId, secretYn } = await request.json();
  console.log("댓글저장 blogId :", blogId);
  console.log("댓글저장 content :", content);
  console.log("댓글저장 parentId :", parentId);
  console.log("댓글저장 secretYn :", secretYn);
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
        secretYn,
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
        deletedAt: null,
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

export async function DELETE(request: Request) {
  const { blogId, id } = await request.json();
  if (!blogId) {
    return NextResponse.json(
      { error: "게시글 번호가 없습니다." },
      { status: 400 }
    );
  }
  if (!id) {
    return NextResponse.json(
      { error: "해당 댓글 번호가 없습니다." },
      { status: 400 }
    );
  }
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "로그인 정보가 없습니다." },
      { status: 401 }
    );
  }

  //댓글삭제구현
  try {
    const result = await prisma.comment.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json(
      { success: "댓글 삭제완료", result },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "카테고리 삭제에 실패했습니다." + err },
      { status: 500 }
    );
  }
}
