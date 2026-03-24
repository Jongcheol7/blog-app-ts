"use client";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import { useRouter } from "next/navigation";
import { useBlogViewsMutation } from "@/hooks/useBlogViews";
import { useSearchStore } from "@/store/useSearchStore";
import HighlightText from "../common/HighlightText";
import { ArrowUpRight } from "lucide-react";

type Props = {
  blog: BlogForm;
  size?: "small" | "list";
};

export default function BlogCard({ blog, size = "small" }: Props) {
  const router = useRouter();
  const { mutateAsync: viewMutate } = useBlogViewsMutation();
  const { setTag, keyword } = useSearchStore();

  const handleClick = () => {
    viewMutate(blog.id);
    router.push(`details/${blog.id}`);
  };

  // List variant — horizontal row
  if (size === "list") {
    return (
      <div
        className="group cursor-pointer flex items-center gap-5 py-5 border-b border-border/40 transition-supanova hover:pl-1"
        onClick={handleClick}
      >
        <div className="shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden img-zoom">
          <Image
            className="object-cover"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            sizes="80px"
            loader={({ src }) => src}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight leading-snug line-clamp-1 group-hover:text-primary transition-supanova">
            <HighlightText text={blog.title} keyword={keyword} />
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            {blog.blogTags?.slice(0, 2).map((bt: { tag: { id: number; name: string } }) => (
              <span
                key={bt.tag.id}
                className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-supanova"
                onClick={(e) => {
                  e.stopPropagation();
                  setTag(bt.tag.name);
                }}
              >
                {bt.tag.name}
              </span>
            ))}
            <span className="text-xs text-muted-foreground/50">{TimeTransform(blog.createdAt).date}</span>
          </div>
        </div>
        <ArrowUpRight className="shrink-0 w-4 h-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-supanova hidden sm:block" />
      </div>
    );
  }

  // Small card variant — compact grid card
  return (
    <div
      className="group cursor-pointer h-full"
      onClick={handleClick}
    >
      <div className="bg-secondary/50 ring-1 ring-border/50 p-1.5 rounded-2xl h-full img-zoom">
        <div className="overflow-hidden rounded-[calc(1rem-0.375rem+0.5rem)] relative h-[160px] sm:h-[180px]">
          <Image
            className="object-cover"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            loader={({ src }) => src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <h3 className="text-sm font-semibold text-white tracking-tight leading-snug line-clamp-1">
              <HighlightText text={blog.title} keyword={keyword} />
            </h3>
            <span className="text-[11px] text-white/40 mt-0.5 block">
              {TimeTransform(blog.createdAt).date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
