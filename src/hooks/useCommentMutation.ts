import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

type CommentProp = {
  blogId: number;
  content: string;
  parentId?: number | null;
  secretYn: boolean;
};

export function useCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      blogId,
      content,
      parentId = null,
      secretYn,
    }: CommentProp) => {
      const res = await axios.post("/api/blog/comment", {
        blogId,
        content,
        parentId,
        secretYn,
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("댓글 저장완료");
        queryClient.invalidateQueries({
          queryKey: ["commentLists", variables.blogId],
        });
      }
    },
    onError: (err) => {
      toast.error("댓글 저장중 오류 발생: " + err);
    },
  });
}

export function useCommentDeleteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blogId, id }: { blogId: number; id: number }) => {
      const res = await axios.delete("/api/blog/comment", {
        data: { blogId, id },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("댓글 삭제완료");
        queryClient.invalidateQueries({
          queryKey: ["commentLists", variables.blogId],
        });
      }
    },
    onError: (err: AxiosError<{ error: string }>) => {
      toast.error(err.response?.data.error);
    },
  });
}
