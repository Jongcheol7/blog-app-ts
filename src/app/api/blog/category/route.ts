import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { category } = await request.json();
  if (!category || category.trim().length === 0) {
    return NextResponse.json(
      { error: "카테고리 이름이 없습니다." },
      { status: 400 }
    );
  }

  // 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "로그인 정보가 없습니다." },
      { status: 401 }
    );
  }

  try {
    const result = await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json(
      { error: "카테고리 저장에 실패했습니다." + err },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await prisma.category.findMany({});
    return NextResponse.json({ categoryLists: result });
  } catch (err) {
    return NextResponse.json(
      { error: "카테고리 조회에 실패했습니다." + err },
      { status: 500 }
    );
  }
}
