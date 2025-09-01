import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCommentLists(id: number) {
  return useInfiniteQuery({
    queryKey: ["commentLists", id],
    queryFn: async ({ pageParam = null, queryKey }) => {
      const [, id] = queryKey;
      const res = await axios.get("/api/blog/comment", {
        params: { id, cursor: pageParam, limit: 10 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
