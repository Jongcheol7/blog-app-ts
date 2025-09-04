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
  createdAt: string; // ISO string
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
    status, // "pending" | "error" | "success"
    fetchStatus, // "fetching" | "paused" | "idle"
  } = useGuestbookLists();

  // 무한스크롤 조회데이터
  const lists: GuestbookItem[] = useMemo(
    () => data?.pages.flatMap((p) => p.lists ?? []) ?? [],
    [data]
  );

  // 무한 스크롤 IntersectionObserver
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

  // 로딩 상태
  if (status === "pending") {
    return (
      <div className="space-y-3">
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </div>
    );
  }

  // 에러 상태
  if (status === "error") {
    return (
      <div className="text-sm text-red-500">
        방명록을 불러오는 중 오류가 발생했어요.
      </div>
    );
  }

  // 데이터 없을 때
  if (lists.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        아직 방명록이 없어요. 첫 글을 남겨보세요! 🎉
      </div>
    );
  }

  // 성공 상태
  return (
    <div className="space-y-2 mt-5">
      {lists.map((item) => {
        const isSecret = item.secretYn;
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-md transition"
          >
            {/* 아바타 */}
            <Avatar className="h-9 w-9">
              {item.user?.image ? (
                <AvatarImage
                  src={item.user.image}
                  alt={item.user?.name || "?"}
                />
              ) : (
                <AvatarFallback>
                  {initial(item.user?.name, item.user?.email)}
                </AvatarFallback>
              )}
            </Avatar>

            {/* 본문 */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{item.user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {TimeTransform(item.createdAt).datetime}
                </span>
                {isSecret && (
                  <span className="ml-1 text-xs text-gray-500">🔒 비밀글</span>
                )}
              </div>
              <p className="mt-1 text-sm whitespace-pre-wrap leading-relaxed">
                {isSecret
                  ? "🔒 작성자와 관리자만 볼 수 있는 글입니다."
                  : item.content}
              </p>
            </div>
          </div>
        );
      })}

      {/* 더 불러오기/마지막 */}
      <div className="flex items-center justify-center py-4">
        {isFetchingNextPage || fetchStatus === "fetching" ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />더 불러오는 중...
          </div>
        ) : hasNextPage ? (
          <button
            ref={sentinelRef}
            onClick={() => fetchNextPage()}
            className="text-sm text-muted-foreground hover:underline"
          >
            더 보기
          </button>
        ) : (
          <div className="text-xs text-muted-foreground">
            마지막 글까지 다 봤어요 👀
          </div>
        )}
      </div>
    </div>
  );
}

/** 캐주얼 스켈레톤 아이템 */
function SkeletonItem() {
  return (
    <div className="flex items-start gap-3 p-3">
      <div className="h-9 w-9 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
      </div>
    </div>
  );
}
