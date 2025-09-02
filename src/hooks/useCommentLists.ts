import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCommentLists(blogId: number) {
  return useInfiniteQuery({
    queryKey: ["commentLists", blogId],
    queryFn: async ({ pageParam = null, queryKey }) => {
      const [, blogId] = queryKey;
      const res = await axios.get("/api/blog/comment", {
        params: { blogId, cursor: pageParam, limit: 10 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
