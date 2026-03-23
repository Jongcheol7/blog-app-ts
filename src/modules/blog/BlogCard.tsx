"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import { useRouter } from "next/navigation";
import { useBlogViewsMutation } from "@/hooks/useBlogViews";
import { useSearchStore } from "@/store/useSearchStore";
import HighlightText from "../common/HighlightText";

type Props = {
  blog: BlogForm;
};

export default function BlogCard({ blog }: Props) {
  const router = useRouter();
  const { mutateAsync: viewMutate } = useBlogViewsMutation();
  const { setTag, keyword } = useSearchStore();

  return (
    <Card
      className="cursor-pointer group overflow-hidden rounded-xl border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={async () => {
        await viewMutate(blog.id);
        router.push(`details/${blog.id}`);
      }}
    >
      <CardContent className="p-0">
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            priority
            loader={({ src }) => src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1.5 px-5 py-4">
        <p className="font-semibold text-base text-foreground line-clamp-1">
          <HighlightText text={blog.title} keyword={keyword} />
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{TimeTransform(blog.createdAt).date}</span>
          <span>·</span>
          <span>{blog.readingTime || ""}</span>
        </div>
        {blog.blogTags && blog.blogTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {blog.blogTags.slice(0, 3).map((bt: { tag: { id: number; name: string } }) => (
              <span
                key={bt.tag.id}
                className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setTag(bt.tag.name);
                }}
              >
                {bt.tag.name}
              </span>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
