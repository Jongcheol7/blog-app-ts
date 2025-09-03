import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type GuestbookProp = {
  content: string;
  secretYn: boolean;
};

export function useGuestbookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ content, secretYn }: GuestbookProp) => {
      const res = await axios.post("/api/guestbook", { content, secretYn });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("방명록 저장 완료");
        queryClient.invalidateQueries({
          queryKey: ["guestbookLists"],
        });
      }
    },
    onError: (err) => {
      toast.error("방명록 저장 에러 : " + err);
    },
  });
}
