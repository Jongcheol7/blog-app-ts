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
      className="cursor-pointer group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-none hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1.5 card-glow"
      onClick={async () => {
        await viewMutate(blog.id);
        router.push(`details/${blog.id}`);
      }}
    >
      <CardContent className="p-0">
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            priority
            loader={({ src }) => src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 px-5 py-4">
        <p className="font-semibold text-[15px] text-foreground line-clamp-1 tracking-tight">
          <HighlightText text={blog.title} keyword={keyword} />
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{TimeTransform(blog.createdAt).date}</span>
          <span className="opacity-30">|</span>
          <span>{blog.readingTime || ""}</span>
        </div>
        {blog.blogTags && blog.blogTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {blog.blogTags.slice(0, 3).map((bt: { tag: { id: number; name: string } }) => (
              <span
                key={bt.tag.id}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-accent/80 text-muted-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
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
