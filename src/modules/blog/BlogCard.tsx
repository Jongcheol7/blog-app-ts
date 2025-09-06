"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DOMPurify from "dompurify";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import { useRouter } from "next/navigation";

type Props = {
  blog: BlogForm;
};

export default function BlogCard({ blog }: Props) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer"
      onClick={() => router.push(`details/${blog.id}`)}
    >
      <CardContent className="group relative">
        <div className="flex relative w-full h-[300px] group-hover:blur-xs">
          <Image
            className="object-cover"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            priority
            loader={({ src }) => src}
          />
        </div>
        <div className="flex flex-col gap-1 p-3 absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 text-gray-300 transition-all">
          <div
            className="max-w-none overflow-hidden relative"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <p className="text-gray-700 font-bold text-[17px] line-clamp-1">
            {blog.title}
          </p>
          <p className="text-gray-600 text-[13px] w-[80px]">
            {" "}
            {TimeTransform(blog.createdAt).date}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
