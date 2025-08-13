"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useBlogWriteMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (formData: BlogForm) => {
      console.log("save api 전");
      console.log("formData : ", formData);
      const res = await axios.post("/api/blog/save", formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogLists"] });
      router.push("/");
    },
    onError: (err) => {
      toast.error("블로그 저장 실패." + err.message);
    },
  });
}
