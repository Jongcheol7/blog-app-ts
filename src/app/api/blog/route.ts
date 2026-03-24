import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

const selectFields = {
  id: true,
  title: true,
  imageUrl: true,
  views: true,
  privateYn: true,
  pinnedYn: true,
  createdAt: true,
  blogTags: { include: { tag: true } },
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const page = searchParams.get("page");
  const limit = Number(searchParams.get("limit"));
  const keyword = searchParams.get("keyword");
  const category = Number(searchParams.get("category"));
  const tag = searchParams.get("tag");

  const session = await getServerSession(authOptions);

  const privateFilter = session?.user?.isAdmin
    ? {}
    : session?.user?.id
      ? { OR: [{ privateYn: false }, { userId: session.user.id }] }
      : { privateYn: false };

  const baseWhere = {
    deletedAt: null,
    ...privateFilter,
    ...(category !== 0 ? { categoryId: category } : {}),
    ...(keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" as const } },
            { content: { contains: keyword, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(tag ? { blogTags: { some: { tag: { name: tag } } } } : {}),
  };

  try {
    // Page-based pagination
    if (page !== null) {
      const pageNum = Math.max(1, Number(page));
      const skip = (pageNum - 1) * limit;

      const [pinned, posts, totalCount] = await Promise.all([
        pageNum === 1
          ? prisma.blog.findFirst({
              where: { deletedAt: null, pinnedYn: true, ...privateFilter },
              orderBy: { id: "desc" },
              select: { ...selectFields, content: true },
            })
          : null,
        prisma.blog.findMany({
          where: { ...baseWhere, pinnedYn: false },
          orderBy: { id: "desc" },
          skip,
          take: limit,
          select: selectFields,
        }),
        prisma.blog.count({
          where: { ...baseWhere, pinnedYn: false },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        pinned: pinned || null,
        result: posts,
        totalCount,
        totalPages,
        currentPage: pageNum,
      });
    }

    // Legacy cursor-based pagination
    if (!cursor) {
      const [pinned, posts] = await Promise.all([
        prisma.blog.findFirst({
          where: { deletedAt: null, pinnedYn: true, ...privateFilter },
          orderBy: { id: "desc" },
          select: { ...selectFields, content: true },
        }),
        prisma.blog.findMany({
          where: { ...baseWhere, pinnedYn: false },
          orderBy: { id: "desc" },
          take: limit,
          select: selectFields,
        }),
      ]);

      const nextCursor =
        posts.length > 0 ? String(posts[posts.length - 1].id) : null;
      return NextResponse.json({
        pinned: pinned || null,
        result: posts,
        nextCursor,
      });
    } else {
      const posts = await prisma.blog.findMany({
        where: { ...baseWhere, pinnedYn: false },
        orderBy: { id: "desc" },
        cursor: { id: Number(cursor) },
        skip: 1,
        take: limit,
        select: selectFields,
      });

      const nextCursor =
        posts.length > 0 ? String(posts[posts.length - 1].id) : null;
      return NextResponse.json({ pinned: null, result: posts, nextCursor });
    }
  } catch (err) {
    console.error("Blog list query failed:", err);
    return NextResponse.json(
      { error: "Blog list query failed" },
      { status: 500 }
    );
  }
}
