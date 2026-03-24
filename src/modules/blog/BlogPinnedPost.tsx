"use client";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import { useRouter } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { useBlogViewsMutation } from "@/hooks/useBlogViews";
import { useSearchStore } from "@/store/useSearchStore";
import HighlightText from "../common/HighlightText";
import { Pin } from "lucide-react";

export default function BlogPinnedPost({ pinnedData }: PinnedPost) {
  const { mutateAsync: viewMutate } = useBlogViewsMutation();
  const router = useRouter();
  const { keyword } = useSearchStore();

  if (!pinnedData) return null;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden cursor-pointer group mb-10"
      onClick={async () => {
        await viewMutate(pinnedData.id);
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
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Pin className="w-3.5 h-3.5 text-white/60" />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Pinned</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold mb-3 line-clamp-2 tracking-tight leading-tight">
          <HighlightText text={pinnedData.title} keyword={keyword} />
        </h2>
        <p
          className="text-sm text-white/60 line-clamp-2 mb-4 max-w-2xl leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(pinnedData.content),
          }}
        />
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 font-medium">
            {TimeTransform(pinnedData.createdAt).date}
          </span>
          <span className="inline-flex items-center text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
            Read more →
          </span>
        </div>
      </div>
    </div>
  );
}
