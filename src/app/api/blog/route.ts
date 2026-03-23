import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

function calcReadingTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit"));
  const keyword = searchParams.get("keyword");
  const category = Number(searchParams.get("category"));
  const tag = searchParams.get("tag");

  const session = await getServerSession(authOptions);

  const includeOpts = {
    blogTags: { include: { tag: true } },
  };

  // 비공개 글은 작성자 또는 관리자만 볼 수 있음
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapPost = (post: any) => ({
      id: post.id,
      title: post.title,
      imageUrl: post.imageUrl,
      views: post.views,
      privateYn: post.privateYn,
      pinnedYn: post.pinnedYn,
      createdAt: post.createdAt,
      blogTags: post.blogTags,
      readingTime: calcReadingTime(post.content),
    });

    if (!cursor) {
      const pinned = await prisma.blog.findFirst({
        where: { deletedAt: null, pinnedYn: true, ...privateFilter },
        orderBy: { id: "desc" },
        include: includeOpts,
      });
      const posts = await prisma.blog.findMany({
        where: {
          ...baseWhere,
          pinnedYn: false,
        },
        orderBy: { id: "desc" },
        take: limit,
        include: includeOpts,
      });
      const result = posts.map(mapPost);
      const nextCursor =
        posts.length > 0 ? String(posts[posts.length - 1].id) : null;
      return NextResponse.json({
        pinned: pinned ? mapPost(pinned) : null,
        result,
        nextCursor,
      });
    } else {
      const posts = await prisma.blog.findMany({
        where: {
          ...baseWhere,
          pinnedYn: false,
        },
        orderBy: { id: "desc" },
        cursor: { id: Number(cursor) },
        skip: 1,
        take: limit,
        include: includeOpts,
      });
      const result = posts.map(mapPost);
      const nextCursor =
        posts.length > 0 ? String(posts[posts.length - 1].id) : null;
      return NextResponse.json({ pinned: null, result, nextCursor });
    }
  } catch (err) {
    console.error("Blog list query failed:", err);
    return NextResponse.json(
      { error: "Blog list query failed" },
      { status: 500 }
    );
  }
}
