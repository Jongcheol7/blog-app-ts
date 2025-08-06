import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCategoryLists() {
  return useQuery({
    queryKey: ["categoryLists"],
    queryFn: async () => {
      const res = await axios.get("/api/blog/category");
      return res.data;
    },
  });
}
