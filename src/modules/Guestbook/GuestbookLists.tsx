"use client";

import { useEffect, useMemo, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGuestbookLists } from "@/hooks/useGuestbookLists";
import { Loader2 } from "lucide-react";
import { TimeTransform } from "../common/TimeTransform";

type GuestbookItem = {
  id: number;
  content: string;
  secretYn: "Y" | "N";
  createdAt: string;
  user: {
    name: string | null;
    image?: string | null;
    email?: string | null;
  };
};

export default function GuestbookLists() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchStatus,
  } = useGuestbookLists();

  const lists: GuestbookItem[] = useMemo(
    () => data?.pages.flatMap((p) => p.lists ?? []) ?? [],
    [data]
  );

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!hasNextPage || !sentinelRef.current) return;

    const ref = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    if (ref) observer.observe(ref);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const initial = (name?: string | null, email?: string | null) => {
    const base = (name || email || "?").trim();
    return base[0]?.toUpperCase() ?? "?";
  };

  if (status === "pending") {
    return (
      <div className="space-y-3">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-sm text-destructive">
        Failed to load guestbook entries.
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        No entries yet. Be the first to leave a message!
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-6">
      {lists.map((item) => {
        const isSecret = item.secretYn;
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:shadow-sm transition-all"
          >
            <Avatar className="h-10 w-10 ring-2 ring-background shrink-0">
              {item.user?.image ? (
                <AvatarImage
                  src={item.user.image}
                  alt={item.user?.name || "?"}
                />
              ) : (
                <AvatarFallback className="text-xs">
                  {initial(item.user?.name, item.user?.email)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 bg-secondary/30 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{item.user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {TimeTransform(item.createdAt).datetime}
                </span>
                {isSecret && (
                  <span className="text-xs text-muted-foreground">Secret</span>
                )}
              </div>
              <p className="mt-1.5 text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                {isSecret
                  ? "This message is only visible to the author and admin."
                  : item.content}
              </p>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-center py-4">
        {isFetchingNextPage || fetchStatus === "fetching" ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more...
          </div>
        ) : hasNextPage ? (
          <button
            ref={sentinelRef}
            onClick={() => fetchNextPage()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Load more
          </button>
        ) : lists.length > 5 ? (
          <div className="text-xs text-muted-foreground">
            You have reached the end.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SkeletonItem() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
      <div className="flex-1 space-y-2 bg-secondary/30 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="h-3 w-28 bg-muted animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
