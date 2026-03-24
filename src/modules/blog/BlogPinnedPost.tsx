"use client";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import { useRouter } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { useBlogViewsMutation } from "@/hooks/useBlogViews";
import { useSearchStore } from "@/store/useSearchStore";
import HighlightText from "../common/HighlightText";
import { ArrowRight } from "lucide-react";

export default function BlogPinnedPost({ pinnedData }: PinnedPost) {
  const { mutateAsync: viewMutate } = useBlogViewsMutation();
  const router = useRouter();
  const { keyword } = useSearchStore();

  if (!pinnedData) return null;

  return (
    <div
      className="relative w-full rounded-[2rem] overflow-hidden cursor-pointer group mb-2"
      onClick={() => {
        viewMutate(pinnedData.id);
        router.push(`details/${pinnedData.id}`);
      }}
    >
      <div className="relative w-full aspect-[21/9] sm:aspect-[2.8/1]">
        <Image
          src={pinnedData.imageUrl || "/globe.svg"}
          alt={pinnedData.title || "Featured post"}
          fill
          priority
          loader={({ src }) => src}
          className="object-cover transition-supanova group-hover:scale-105"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-white">
        <span className="eyebrow mb-4 inline-flex !bg-white/10 !text-white/70 backdrop-blur-sm">
          Pinned
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 line-clamp-2 tracking-tight leading-snug max-w-3xl">
          <HighlightText text={pinnedData.title} keyword={keyword} />
        </h2>
        <p
          className="text-sm text-white/50 line-clamp-2 mb-5 max-w-2xl leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(pinnedData.content),
          }}
        />
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30 font-medium">
            {TimeTransform(pinnedData.createdAt).date}
          </span>
          <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full transition-supanova group-hover:bg-white/20">
            Read more
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-supanova group-hover:translate-x-0.5">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
