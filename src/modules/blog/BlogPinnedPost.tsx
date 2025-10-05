"use client";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import { useRouter } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { useMobileStore } from "@/store/useMobileStore";

export default function BlogPinnedPost({ pinnedData }: PinnedPost) {
  const { isMobile } = useMobileStore();
  const router = useRouter();
  return (
    <div>
      {pinnedData && (
        <div
          className="flex border-b pb-1 cursor-pointer"
          onClick={() => router.push(`details/${pinnedData.id}`)}
        >
          <div
            className={`relative w-[55%] mb-10 ${
              isMobile ? "h-[230px]" : "h-[330px]"
            }`}
          >
            <Image
              src={pinnedData.imageUrl || "/globe.svg"}
              alt={pinnedData.title || "게시글 대표 이미지"}
              fill
              priority
              loader={({ src }) => src}
              className="shadow-2xl"
            />
          </div>
          <div className="flex-1 ml-3 flex flex-col">
            <p className="font-bold text-2xl mb-2 text-gray-700">
              {pinnedData.title}
            </p>
            <p
              className="line-clamp-2 text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(pinnedData.content),
              }}
            ></p>
            <p className="self-end">
              {TimeTransform(pinnedData.createdAt).date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
