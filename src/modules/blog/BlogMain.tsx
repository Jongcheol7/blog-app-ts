"use client";
import { useBlogLists } from "@/hooks/useBlogLists";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import BlogCard from "./BlogCard";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchStore } from "@/store/useSearchStore";
import BlogPinnedPost from "./BlogPinnedPost";

export default function BlogMain() {
  const observerRef = useRef(null);
  const { keyword, category } = useSearchStore();
  const {
    data,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useBlogLists({ keyword, category });
  const queryClient = useQueryClient();

  const pinnedData = useMemo(() => {
    if (!data?.pages?.length) return [];
    const firstPinned = data.pages[0]?.pinned;
    return firstPinned ? firstPinned : null;
  }, [data]);

  const allBlogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.result) ?? [];
  }, [data]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["blogLists"] });
    refetch();
  }, [keyword, category, queryClient, refetch]);

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
      <BlogPinnedPost pinnedData={pinnedData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-2 py-10">
        {allBlogs &&
          allBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
      </div>
      <div ref={observerRef} />
      {isFetchingNextPage && <p>글 불러오는 중...</p>}
    </div>
  );
}
