"use client";
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
    <div
      className="card-bezel cursor-pointer group"
      onClick={async () => {
        await viewMutate(blog.id);
        router.push(`details/${blog.id}`);
      }}
    >
      <div className="card-bezel-inner">
        {/* Image */}
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

        {/* Content */}
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
