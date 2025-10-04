import axios, { AxiosError } from "axios";
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

export function useCategoryDelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: string) => {
      const res = await axios.delete("/api/blog/category", {
        data: { category: category },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("카테고리 삭제완료");
      queryClient.invalidateQueries({ queryKey: ["categoryLists"] });
    },
    onError: (err: AxiosError<{ error: string }>) => {
      console.log("err :", err);
      toast.error(err.response?.data.error);
    },
  });
}
