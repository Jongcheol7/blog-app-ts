"use client";
import { useBlogLists } from "@/hooks/useBlogLists";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import BlogCard from "./BlogCard";
import { useSearchStore } from "@/store/useSearchStore";
import BlogPinnedPost from "./BlogPinnedPost";
import { Loader2 } from "lucide-react";
import ScrollReveal from "../common/ScrollReveal";

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
    isLoading,
  } = useBlogLists({ keyword, category, tag });

  const pinnedData = useMemo(() => {
    if (!data?.pages?.length) return [];
    const firstPinned = data.pages[0]?.pinned;
    return firstPinned ? firstPinned : null;
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
    toast.error(`Error: ${message}`);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/40" />
      </div>
    );
  }

  if (!allBlogs?.length && !pinnedData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-lg font-medium text-muted-foreground">No posts found.</p>
        <p className="text-sm text-muted-foreground/50">Check back later for new content.</p>
      </div>
    );
  }

  // Split blogs into sections for mixed layout
  const featurePosts = allBlogs.slice(0, 2);
  const listPosts = allBlogs.slice(2, 6);
  const gridPosts = allBlogs.slice(6);

  return (
    <div className="pt-10">
      {tag && (
        <div className="flex items-center gap-2.5 mb-8">
          <span className="text-sm text-muted-foreground">Filtered by</span>
          <button
            onClick={() => setTag("")}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-supanova cursor-pointer"
          >
            # {tag} ×
          </button>
        </div>
      )}

      {/* Pinned Post */}
      <BlogPinnedPost pinnedData={pinnedData} />

      {/* Feature Section — 2 large posts side by side */}
      {featurePosts.length > 0 && (
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
            {featurePosts.map((blog, i) => (
              <ScrollReveal key={blog.id} delay={i * 100}>
                <BlogCard blog={blog} variant="feature" />
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* List Section — editorial style */}
      {listPosts.length > 0 && (
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Latest</h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <div>
              {listPosts.map((blog, i) => (
                <ScrollReveal key={blog.id} delay={i * 80}>
                  <BlogCard blog={blog} variant="list" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Grid Section — card grid */}
      {gridPosts.length > 0 && (
        <ScrollReveal>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">More Posts</h2>
              <div className="flex-1 h-px bg-border/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gridPosts.map((blog, i) => (
                <ScrollReveal key={blog.id} delay={i * 80}>
                  <BlogCard blog={blog} variant="card" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      <div ref={observerRef} />
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/30" />
        </div>
      )}
    </div>
  );
}
