import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export function useBlogViewsMutation() {
  return useMutation({
    mutationFn: async (blogId: number) => {
      const res = await axios.post("/api/blog/views", {
        blogId,
      });
      return res.data;
    },
    onSuccess: () => {},
    onError: (err: AxiosError<{ error: string }>) => {
      toast.error(err.response?.data.error);
    },
  });
}
