import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { id, content, parentId } = await request.json();
  console.log("댓글저장 id :", id);
  console.log("댓글저장 content :", content);
  console.log("댓글저장 parentId :", parentId);
  if (!id) {
    console.error("Comment 저장시 id를 찾을수 없습니다.");
    return NextResponse.json(
      { error: "Comment 저장시 id를 찾을수 없습니다." },
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
        blogId: id,
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
