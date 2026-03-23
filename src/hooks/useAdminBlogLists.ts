"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAdminBlogLists() {
  return useQuery({
    queryKey: ["adminBlogLists"],
    queryFn: async () => {
      const res = await axios.get("/api/blog/admin");
      return res.data;
    },
  });
}
