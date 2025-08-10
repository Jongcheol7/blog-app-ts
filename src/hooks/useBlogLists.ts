"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useBlogLists() {
  return useInfiniteQuery({
    queryKey: ["blogLists"],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/blog", {
        params: {
          cursor: pageParam,
          limit: 10,
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
