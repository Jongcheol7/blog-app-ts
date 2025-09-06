"use client";
import { useBlogLists } from "@/hooks/useBlogLists";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import BlogCard from "./BlogCard";
import Image from "next/image";
import { TimeTransform } from "../common/TimeTransform";
import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";

export default function BlogMain() {
  const observerRef = useRef(null);
  const router = useRouter();
  const {
    data,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    //refetch,
  } = useBlogLists();

  const pinnedData = useMemo(() => {
    return data?.pages.flatMap((page) => page.pinned) ?? [];
  }, [data]);
  const allBlogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.result) ?? [];
  }, [data]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    const target = observerRef.current;
    if (target) observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isError) {
    const message = error?.message;
    toast.error(`에러 발생 : ${message}`);
  }

  return (
    <div className="pt-3">
      {pinnedData.length > 0 && (
        <div
          className="flex border-b pb-1 cursor-pointer"
          onClick={() => router.push(`details/${pinnedData[0].id}`)}
        >
          <div className=" relative w-[55%] h-[330px] mb-10">
            <Image
              src={pinnedData[0].imageUrl}
              alt={pinnedData[0].title}
              fill
              priority
              loader={({ src }) => src}
              className="shadow-2xl"
            />
          </div>
          <div className="flex-1 ml-3 flex flex-col">
            <p className="font-bold text-2xl mb-2 text-gray-700">
              {pinnedData[0].title}
            </p>
            <p
              className="line-clamp-2 text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(pinnedData[0].content),
              }}
            ></p>
            <p className="self-end">
              {TimeTransform(pinnedData[0].createdAt).date}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-2 py-10">
        {allBlogs &&
          allBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
      </div>
      <div ref={observerRef} />
      {isFetchingNextPage && <p>글 불러오는 중...</p>}
    </div>
  );
}
