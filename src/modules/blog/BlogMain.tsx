"use client";
import { useBlogLists } from "@/hooks/useBlogLists";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import BlogCard from "./BlogCard";
import { Input } from "@/components/ui/input";

export default function BlogMain() {
  const observerRef = useRef(null);
  const {
    data,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useBlogLists();

  const allBlogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.result) ?? [];
  }, [data]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    const target = observerRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isError) {
    const message = error?.message;
    toast.error(`에러 발생 : ${message}`);
  }

  console.log("data allBlogs :", allBlogs);
  return (
    <div>
      <div className="flex gap-1 mb-2">
        <Input
          className="w-[200px]"
          type="text"
          placeholder="검색어를 입력하세요"
        />
        <Link
          href={"/write"}
          className="bg-gray-400 hover:bg-gray-600 transition-all text-gray-100 px-2 py-1 rounded-md text-center"
        >
          새글추가
        </Link>
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
          {allBlogs &&
            allBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
        <div ref={observerRef} />
        {isFetchingNextPage && <p>글 불러오는 중...</p>}
      </div>
    </div>
  );
}
