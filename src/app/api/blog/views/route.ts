import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { blogId } = await req.json();

  if (!blogId) {
    console.error("글 번호가 없습니다.");
    return NextResponse.json({ error: "글 번호가 없습니다." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  // 헤더에서 IP주소 가져오기
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

  console.log("blogId : ", blogId);
  console.log("forwardedFor : ", forwardedFor);
  console.log("realIp : ", realIp);
  console.log("ip : ", ip);
  console.log("session.user : ", session?.user);

  try {
    // 최근 30분 내 조회한적이 있는지(중복확인)
    const recentView = await prisma.blogViews.findFirst({
      where: {
        blogId,
        OR: [{ userId: session?.user?.id ?? null }, { ipAddress: ip }],
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000),
        },
      },
    });

    if (recentView) {
      console.log("중복조회: 최근에 이미 조회했습니다. 카운트 생략");
      return NextResponse.json(
        { message: "최근에 이미 조회했습니다." },
        { status: 200 }
      );
    }

    await prisma.blogViews.create({
      data: {
        blogId: blogId,
        userId: session?.user?.id ?? null,
        ipAddress: ip,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("조회수 증가에 실패했습니다.", err);
    return NextResponse.json(
      { error: "조회수 증가에 실패했습니다." },
      { status: 500 }
    );
  }
}
