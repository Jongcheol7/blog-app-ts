import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { id, title, content, tags, category, imageUrl, privateYn, pinnedYn } =
    await request.json();

  console.log("id : ", id);
  console.log("title : ", title);
  console.log("content : ", content);
  console.log("tags : ", tags);
  console.log("category : ", category);
  console.log("privateYn : ", privateYn);
  console.log("imageUrl : ", imageUrl);
  console.log("pinnedYn :", pinnedYn);

  if (!title || title.trim().length === 0) {
    console.error("글 제목이 없습니다.");
    return NextResponse.json({ error: "글 제목이 없습니다." }, { status: 400 });
  }
  if (!content || content.trim().length === 0) {
    console.error("글 내용이 없습니다.");
    return NextResponse.json({ error: "글 내용이 없습니다." }, { status: 400 });
  }
  if (category === "") {
    console.error("카테고리가 없습니다.");
    return NextResponse.json(
      { error: "카테고리가 없습니다." },
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
  console.log("태그 저장전");
  try {
    // Tags 저장
    const tagResults = await Promise.all(
      tags.map((tag: string) =>
        prisma.tags.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        })
      )
    );

    // 핀을 지정했다면 기존에 저장된 핀은 제거하자.
    if (pinnedYn) {
      await prisma.blog.updateMany({
        where: { pinnedYn: true },
        data: {
          pinnedYn: false,
        },
      });
    }

    // Blog 저장
    let blogResult;
    if (id) {
      blogResult = await prisma.blog.update({
        where: { id },
        data: {
          title,
          content,
          privateYn,
          pinnedYn,
          imageUrl,
          categoryId: Number(category),
        },
      });
    } else {
      blogResult = await prisma.blog.create({
        data: {
          title,
          content,
          userId: session.user.id,
          privateYn,
          pinnedYn,
          imageUrl,
          categoryId: Number(category),
        },
      });
    }

    console.log("blogResult : ", blogResult);

    // 기존 Tags 삭제
    await prisma.blogTags.deleteMany({
      where: { blogId: id },
    });

    // BlogTags 저장
    await Promise.all(
      tagResults.map((tag) =>
        prisma.blogTags.create({
          data: {
            blogId: blogResult.id,
            tagId: tag.id,
          },
        })
      )
    );

    return NextResponse.json({ blogResult });
  } catch (err) {
    console.error("글 저장에 실패했습니다." + err);
    return NextResponse.json(
      { error: "글 저장에 실패했습니다.: " + err },
      { status: 500 }
    );
  }
}
