"use client";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import { useRouter } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { useBlogViewsMutation } from "@/hooks/useBlogViews";
import { useSearchStore } from "@/store/useSearchStore";
import HighlightText from "../common/HighlightText";

export default function BlogPinnedPost({ pinnedData }: PinnedPost) {
  const { mutateAsync: viewMutate } = useBlogViewsMutation();
  const router = useRouter();
  const { keyword } = useSearchStore();

  if (!pinnedData) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group mb-8"
      onClick={async () => {
        await viewMutate(pinnedData.id);
        router.push(`details/${pinnedData.id}`);
      }}
    >
      <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1]">
        <Image
          src={pinnedData.imageUrl || "/globe.svg"}
          alt={pinnedData.title || "Featured post"}
          fill
          priority
          loader={({ src }) => src}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">
          <HighlightText text={pinnedData.title} keyword={keyword} />
        </h2>
        <p
          className="text-sm text-white/70 line-clamp-2 mb-3 max-w-2xl"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(pinnedData.content),
          }}
        />
        <p className="text-xs text-white/50 font-medium">
          {TimeTransform(pinnedData.createdAt).date}
        </p>
      </div>
    </div>
  );
}
