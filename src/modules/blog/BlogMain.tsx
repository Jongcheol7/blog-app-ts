"use client";
import { useBlogLists } from "@/hooks/useBlogLists";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import BlogCard from "./BlogCard";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchStore } from "@/store/useSearchStore";
import BlogPinnedPost from "./BlogPinnedPost";
import { Loader2 } from "lucide-react";

export default function BlogMain() {
  const observerRef = useRef(null);
  const { keyword, category, tag, setTag } = useSearchStore();
  const {
    data,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isLoading,
  } = useBlogLists({ keyword, category, tag });
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
  }, [keyword, category, tag, queryClient, refetch]);

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
    toast.error(`Error: ${message}`);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!allBlogs?.length && !pinnedData) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-light text-muted-foreground">
        No posts found.
      </div>
    );
  }

  return (
    <div className="pt-6">
      {tag && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Filtered by tag:</span>
          <button
            onClick={() => setTag("")}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
          >
            # {tag} ×
          </button>
        </div>
      )}
      <BlogPinnedPost pinnedData={pinnedData} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {allBlogs &&
          allBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
      </div>
      <div ref={observerRef} />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
