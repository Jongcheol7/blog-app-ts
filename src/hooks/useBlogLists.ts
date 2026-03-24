"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Prop = {
  keyword: string;
  category: number;
  tag?: string;
  page?: number;
  limit?: number;
};

export function useBlogLists({ keyword, category, tag, page = 1, limit = 12 }: Prop) {
  return useQuery({
    queryKey: ["blogLists", { keyword, category, tag, page, limit }],
    queryFn: async () => {
      const res = await axios.get("/api/blog", {
        params: {
          page,
          limit,
          keyword,
          category,
          tag: tag || undefined,
        },
      });
      return res.data;
    },
  });
}
