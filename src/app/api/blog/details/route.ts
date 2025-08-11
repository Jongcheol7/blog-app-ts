import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  try {
    const details = await prisma.blog.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json({ details });
  } catch (err) {
    console.error("글 상세조회 실패 :", err);
    return NextResponse.json({ error: "글 상세조회 실패" }, { status: 500 });
  }
}
