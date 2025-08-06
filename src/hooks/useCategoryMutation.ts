import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      const res = await axios.post("/api/blog/category", { category });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryLists"] });
    },
    onError: (err) =>
      toast.error("카테고리 추가에 실패했습니다." + err.message),
  });
}
