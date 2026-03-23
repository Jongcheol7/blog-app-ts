import { prisma } from "@/lib/prisma";

export async function GET() {
  const siteUrl = process.env.NEXTAUTH_URL || "https://blog-app-ts-iota.vercel.app";

  const posts = await prisma.blog.findMany({
    where: { deletedAt: null, privateYn: false },
    orderBy: { id: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const items = posts
    .map((post) => {
      const description = post.content
        .replace(/<[^>]+>/g, " ")
        .trim()
        .slice(0, 300);
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/details/${post.id}</link>
      <guid isPermaLink="true">${siteUrl}/details/${post.id}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jongcheol Lee — Blog</title>
    <link>${siteUrl}</link>
    <description>Developer blog by Jongcheol Lee</description>
    <language>ko</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
