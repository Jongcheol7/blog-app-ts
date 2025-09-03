import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGuestbookLists() {
  return useInfiniteQuery({
    queryKey: ["guestbookLists"],
    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get("/api/guestboog", {
        params: { cursor: pageParam, limit: 10 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
    initialPageParam: null,
  });
}
