import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [posts, totalViewsAgg, postsThisMonth, totalPosts] =
      await Promise.all([
        prisma.blog.findMany({
          orderBy: { id: "desc" },
          select: {
            id: true,
            title: true,
            views: true,
            privateYn: true,
            pinnedYn: true,
            deletedAt: true,
            createdAt: true,
            categoryId: true,
            category: { select: { name: true } },
            _count: { select: { comments: true } },
          },
        }),
        prisma.blog.aggregate({
          _sum: { views: true },
          where: { deletedAt: null },
        }),
        prisma.blog.count({
          where: {
            deletedAt: null,
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.blog.count({
          where: { deletedAt: null },
        }),
      ]);

    return NextResponse.json({
      posts,
      stats: {
        totalPosts,
        totalViews: totalViewsAgg._sum.views || 0,
        postsThisMonth,
      },
    });
  } catch (err) {
    console.error("Admin data query failed:", err);
    return NextResponse.json(
      { error: "Admin data query failed" },
      { status: 500 }
    );
  }
}
