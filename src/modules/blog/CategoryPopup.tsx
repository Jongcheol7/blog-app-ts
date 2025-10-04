import { Input } from "@/components/ui/input";
import {
  useCategoryDelMutation,
  useCategoryMutation,
} from "@/hooks/useCategoryMutation";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useCategoryLists } from "@/hooks/useCategoryLists";

type Props = {
  setShow: (value: boolean) => void;
};

export default function CategoryPopup({ setShow }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useCategoryLists();
  const { mutate: saveMutate, isPending: savePending } = useCategoryMutation();
  const { mutate: deleteMutate } = useCategoryDelMutation();

  const handleAddCategory = (category: string) => {
    if (!category) return;
    saveMutate(category, {
      onSuccess: () => {
        setShow(false);
      },
    });
  };

  return (
    <div>
      <motion.div
        className="fixed bg-white left-1/2 -translate-x-1/2 
                top-1/2 -translate-y-1/2 pt-8 pb-5 rounded-xl z-50 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-2xl font-bold text-center">Category Setting</p>
        <Input
          className="bg-gray-200 px-3 py-3 mx-5 w-[300px] rounded-lg my-3"
          placeholder="새 카테고리를 위한 이름"
          ref={inputRef}
        />

        {/* 리스트 */}
        <div className="flex gap-1 my-2 px-5">
          {data?.categoryLists &&
            data.categoryLists.map((cat: Category) => (
              <button
                className={`p-2 bg-gray-200 rounded-md font-bold cursor-pointer hover:bg-red-400`}
                key={cat.id}
                onClick={() => deleteMutate(cat.name)}
              >
                {cat.name}
              </button>
            ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-5 justify-self-center mr-6">
          <button
            className="p-2 rounded-md bg-gray-200 text-red-500 font-bold cursor-pointer"
            onClick={() => setShow(false)}
          >
            Cancel
          </button>
          <button
            className="p-2 rounded-md bg-gray-200 text-blue-500 font-bold cursor-pointer"
            onClick={() => handleAddCategory(inputRef.current?.value ?? "")}
            disabled={savePending}
          >
            {savePending ? "Adding" : "Add"}
          </button>
        </div>
      </motion.div>
      <motion.div
        className="fixed inset-0 z-40 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setShow(false)}
      />
    </div>
  );
}
