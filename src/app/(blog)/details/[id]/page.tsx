import BlogDetails from "@/modules/blog/BlogDetails";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id: Number(id) },
    select: { title: true, content: true, imageUrl: true },
  });

  if (!blog) {
    return { title: "Post not found" };
  }

  const description = blog.content
    .replace(/<[^>]+>/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title: blog.title,
    description,
    openGraph: {
      title: blog.title,
      description,
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <BlogDetails id={id} />;
}
