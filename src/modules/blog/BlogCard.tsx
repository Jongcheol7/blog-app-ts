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
  variant?: "card" | "feature" | "list";
};

export default function BlogCard({ blog, variant = "card" }: Props) {
  const router = useRouter();
  const { mutateAsync: viewMutate } = useBlogViewsMutation();
  const { setTag, keyword } = useSearchStore();

  const handleClick = () => {
    viewMutate(blog.id);
    router.push(`details/${blog.id}`);
  };

  if (variant === "feature") {
    return (
      <div
        className="group cursor-pointer relative rounded-[2rem] overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            className="object-cover transition-supanova group-hover:scale-105"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            priority
            loader={({ src }) => src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {blog.blogTags?.slice(0, 2).map((bt: { tag: { id: number; name: string } }) => (
              <span
                key={bt.tag.id}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setTag(bt.tag.name);
                }}
              >
                {bt.tag.name}
              </span>
            ))}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug line-clamp-2 mb-2">
            <HighlightText text={blog.title} keyword={keyword} />
          </h3>
          <span className="text-xs text-white/50">{TimeTransform(blog.createdAt).date}</span>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div
        className="group cursor-pointer flex items-center gap-6 py-6 border-b border-border/40 transition-supanova hover:pl-2"
        onClick={handleClick}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {blog.blogTags?.slice(0, 2).map((bt: { tag: { id: number; name: string } }) => (
              <span
                key={bt.tag.id}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-supanova"
                onClick={(e) => {
                  e.stopPropagation();
                  setTag(bt.tag.name);
                }}
              >
                {bt.tag.name}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold tracking-tight leading-snug line-clamp-1 mb-1.5 group-hover:text-primary transition-supanova">
            <HighlightText text={blog.title} keyword={keyword} />
          </h3>
          <span className="text-xs text-muted-foreground">{TimeTransform(blog.createdAt).date}</span>
        </div>
        <div className="shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden">
          <Image
            className="object-cover transition-supanova group-hover:scale-110"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            loader={({ src }) => src}
          />
        </div>
        <ArrowUpRight className="shrink-0 w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-supanova hidden sm:block" />
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className="card-bezel cursor-pointer group"
      onClick={handleClick}
    >
      <div className="card-bezel-inner">
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <Image
            className="object-cover transition-supanova group-hover:scale-110"
            src={blog.imageUrl}
            alt={blog.title}
            fill
            priority
            loader={({ src }) => src}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-supanova" />
        </div>
        <div className="flex flex-col gap-2.5 px-5 py-4">
          <h3 className="font-semibold text-[15px] text-foreground line-clamp-1 tracking-tight leading-snug">
            <HighlightText text={blog.title} keyword={keyword} />
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{TimeTransform(blog.createdAt).date}</span>
            <span className="opacity-30">|</span>
            <span>{blog.readingTime || ""}</span>
          </div>
          {blog.blogTags && blog.blogTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {blog.blogTags.slice(0, 3).map((bt: { tag: { id: number; name: string } }) => (
                <span
                  key={bt.tag.id}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-supanova"
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
        </div>
      </div>
    </div>
  );
}
