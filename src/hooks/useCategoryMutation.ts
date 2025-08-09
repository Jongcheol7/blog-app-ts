import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/router";

export function useCategoryMutation() {
  const router = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      const res = await axios.post("/api/blog/category", { category });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryLists"] });
      router.push("/");
    },
    onError: (err) =>
      toast.error("카테고리 추가에 실패했습니다." + err.message),
  });
}
