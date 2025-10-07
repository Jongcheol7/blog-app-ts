import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // blogViews 테이블에서 blogId 별로 조회수 집계
    const views = await prisma.blogViews.groupBy({
      by: ["blogId"],
      _count: { blogId: true },
    });

    // blog 테이블 view 컬럼 업데이트
    await Promise.all(
      views.map((view) =>
        prisma.blog.update({
          where: { id: view.blogId },
          data: { views: view._count.blogId },
        })
      )
    );

    return NextResponse.json({
      message: "Blog views updated successfully",
      updatedCount: views.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update views" },
      { status: 500 }
    );
  }
}
