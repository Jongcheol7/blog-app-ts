import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
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

export async function DELETE(request: Request) {
  try {
    const { category } = await request.json();

    if (!category) {
      return NextResponse.json(
        { message: "카테고리를 선택하세요." },
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

    //카테고리명으로 카테고리 id를 가지고 있는 블로그가 있는지 확인
    const categoryData = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!categoryData) {
      return NextResponse.json(
        { error: "존재하지 않는 카테고리입니다." },
        { status: 404 }
      );
    }

    console.log("categoryData : ", categoryData);
    const usedBlogs = await prisma.blog.findMany({
      where: { categoryId: categoryData.id },
      select: { id: true, title: true },
    });

    console.log("usedBlogs : ", usedBlogs);
    if (usedBlogs.length > 0) {
      return NextResponse.json(
        { error: "해당 카테고리로 등록된 게시물이 있습니다." },
        { status: 409 }
      );
    }

    const result = await prisma.category.delete({
      where: { id: categoryData.id },
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "카테고리 삭제에 실패했습니다." + err },
      { status: 500 }
    );
  }
}
