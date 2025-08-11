"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useBlogDetails(id: number) {
  return useQuery({
    queryKey: ["blogDetails"],
    queryFn: async () => {
      const res = await axios.get(`/api/blog/details?id=${id}`);
      return res.data;
    },
  });
}
