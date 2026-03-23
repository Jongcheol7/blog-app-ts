import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const [prev, next] = await Promise.all([
      prisma.blog.findFirst({
        where: { id: { lt: id }, deletedAt: null, privateYn: false },
        orderBy: { id: "desc" },
        select: { id: true, title: true, imageUrl: true },
      }),
      prisma.blog.findFirst({
        where: { id: { gt: id }, deletedAt: null, privateYn: false },
        orderBy: { id: "asc" },
        select: { id: true, title: true, imageUrl: true },
      }),
    ]);

    return NextResponse.json({ prev, next });
  } catch (err) {
    console.error("Adjacent posts query failed:", err);
    return NextResponse.json(
      { error: "Adjacent posts query failed" },
      { status: 500 }
    );
  }
}
