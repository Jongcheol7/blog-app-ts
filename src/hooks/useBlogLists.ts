"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Prop = {
  keyword: string;
  category: number;
};

export function useBlogLists({ keyword, category }: Prop) {
  return useInfiniteQuery({
    queryKey: ["blogLists"],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/blog", {
        params: {
          cursor: pageParam,
          limit: 10,
          keyword,
          category,
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

/*
export function useBlogPreFetch({ keyword, category }: Prop) {
  const queryClient = useQueryClient();

  const prefetch = async (page: string | null) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["blogLists"],
      queryFn: async ({ pageParam = page }) => {
        const res = await axios.get("/api/blog", {
          params: {
            cursor: pageParam,
            limit: 10,
            keyword,
            category,
          },
        });
        return res.data;
      },
      initialPageParam: page,
    });
  };
}
*/
