"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAdjacentPosts(id: number) {
  return useQuery({
    queryKey: ["adjacentPosts", id],
    queryFn: async () => {
      const res = await axios.get(`/api/blog/adjacent?id=${id}`);
      return res.data;
    },
  });
}
