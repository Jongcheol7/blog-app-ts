"use client";
import { useBlogLists } from "@/hooks/useBlogLists";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import BlogCard from "./BlogCard";
import { useSearchStore } from "@/store/useSearchStore";
import BlogPinnedPost from "./BlogPinnedPost";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "../common/ScrollReveal";

const PAGE_SIZE = 12;
const SMALL_CARD_COUNT = 4;

export default function BlogMain() {
  const [page, setPage] = useState(1);
  const { keyword, category, tag, setTag } = useSearchStore();

  const prevCategory = useRef(category);
  const prevKeyword = useRef(keyword);
  const prevTag = useRef(tag);

  useEffect(() => {
    if (
      prevCategory.current !== category ||
      prevKeyword.current !== keyword ||
      prevTag.current !== tag
    ) {
      setPage(1);
      prevCategory.current = category;
      prevKeyword.current = keyword;
      prevTag.current = tag;
    }
  }, [category, keyword, tag]);
  const { data, isError, error, isLoading } = useBlogLists({
    keyword,
    category,
    tag,
    page,
    limit: PAGE_SIZE,
  });

  const pinnedData = data?.pinned ?? null;
  const allBlogs: BlogForm[] = data?.result ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  if (isError) {
    toast.error(`Error: ${error?.message}`);
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

  const smallCards = page === 1 ? allBlogs.slice(0, SMALL_CARD_COUNT) : [];
  const listPosts = page === 1 ? allBlogs.slice(SMALL_CARD_COUNT) : allBlogs;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-10">
      {tag && (
        <div className="flex items-center gap-2.5 mb-8">
          <span className="text-sm text-muted-foreground">Filtered by</span>
          <button
            onClick={() => { setTag(""); setPage(1); }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-supanova cursor-pointer"
          >
            # {tag} ×
          </button>
        </div>
      )}

      {/* Pinned Post — only on page 1 */}
      {page === 1 && <BlogPinnedPost pinnedData={pinnedData} />}

      {/* Small Cards Grid — only on page 1 */}
      {smallCards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-16">
          {smallCards.map((blog, i) => (
            <ScrollReveal key={blog.id} delay={i * 80}>
              <BlogCard blog={blog} size="small" />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* List Section */}
      {listPosts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Latest</h2>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <div>
            {listPosts.map((blog, i) => (
              <ScrollReveal key={blog.id} delay={i * 60}>
                <BlogCard blog={blog} size="list" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-supanova hover:bg-secondary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 7) return true;
              if (p === 1 || p === totalPages) return true;
              if (Math.abs(p - page) <= 1) return true;
              return false;
            })
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`dot-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground/40 text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item as number)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-supanova cursor-pointer ${
                    page === item
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-supanova hover:bg-secondary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
