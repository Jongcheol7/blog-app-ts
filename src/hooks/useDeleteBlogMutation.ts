"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete("/api/blog/delete", {
        data: { id },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post deleted.");
      queryClient.invalidateQueries({ queryKey: ["blogLists"] });
      router.push("/blog");
    },
    onError: () => {
      toast.error("Failed to delete post.");
    },
  });
}
