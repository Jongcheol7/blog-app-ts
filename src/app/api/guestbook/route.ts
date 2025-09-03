import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = Number(searchParams.get("cursor"));
  const limit = Number(searchParams.get("limit")) || 10;

  try {
    const lists = await prisma.guestbook.findMany({
      include: { user: true },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { id: "desc" },
    });
    const nextCursor = lists.length > 0 ? lists[lists.length - 1].id : null;
    return NextResponse.json({ lists, nextCursor });
  } catch (err) {
    console.error("방명록 조회에 실패했습니다.(서버)", err);
    return NextResponse.json(
      { error: "방명록 조회에 실패했습니다.(서버)" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { content, secretYn } = await request.json();
  console.log("방명록 저장 content :", content);
  console.log("방명록 저장 secretYn :", secretYn);

  if (!content || content.trim() === "") {
    console.error("방명록 저장시 오류 발생(서버)");
    return NextResponse.json(
      { error: "방명록 저장시 오류 발생(서버)" },
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
    await prisma.guestbook.create({
      data: {
        userId: session.user.id,
        content,
        secretYn,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("방명록 저장에 실패했습니다 :", err);
    return NextResponse.json(
      { error: "방명록 저장에 실패했습니다" },
      { status: 500 }
    );
  }
}
