"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

type Prop = {
  keyword: string;
  category: number;
  tag?: string;
};

export function useBlogLists({ keyword, category, tag }: Prop) {
  return useInfiniteQuery({
    queryKey: ["blogLists"],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/blog", {
        params: {
          cursor: pageParam,
          limit: 10,
          keyword,
          category,
          tag: tag || undefined,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
