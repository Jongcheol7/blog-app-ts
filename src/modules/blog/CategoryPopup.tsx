import { Input } from "@/components/ui/input";
import { useCategoryMutation } from "@/hooks/useCategoryMutation";
import { useRef } from "react";

type Props = {
  setShow: (value: boolean) => void;
};

export default function CategoryPopup({ setShow }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCategoryMutation();

  const handleAddCategory = (category: string) => {
    if (!category) return;
    mutate(category, {
      onSuccess: () => {
        setShow(false);
      },
    });
  };

  return (
    <div>
      <div
        className="fixed bg-white left-1/2 -translate-x-1/2 
                top-1/2 -translate-y-1/2 pt-8 pb-5 rounded-xl z-50 shadow-lg"
      >
        <p className="text-2xl font-bold text-center">새 카테고리 추가</p>
        <Input
          className="bg-gray-200 px-3 py-3 mx-5 w-[300px] rounded-lg my-3"
          placeholder="새 카테고리를 위한 이름"
          ref={inputRef}
        />
        <div className="flex gap-5 justify-self-center mr-6">
          <button
            className="text-blue-500 font-bold"
            onClick={() => setShow(false)}
            // disabled={isPending}
          >
            취소
          </button>
          <button
            className="text-blue-500 font-bold"
            onClick={() => handleAddCategory(inputRef.current?.value ?? "")}
            disabled={isPending}
          >
            {isPending ? "추가중" : "추가"}
          </button>
        </div>
      </div>
      <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
    </div>
  );
}
