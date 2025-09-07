"use client";
import { useCategoryLists } from "@/hooks/useCategoryLists";
import { useFromStore } from "@/store/useFromStore";
import { useSearchStore } from "@/store/useSearchStore";

type CategoryType = {
  id: number;
  name: string;
};

export default function CategoryNav() {
  const { data } = useCategoryLists();
  const { from } = useFromStore();
  const { category, setCategory } = useSearchStore();
  console.log("CategoryNav data :", data);
  console.log("categoryNav from :", from);
  if (from === "/guestbook" || from === "/about") return;
  return (
    <div className="flex gap-2 pb-3 border-b">
      <button
        className={`py-2 px-2 font-bold rounded-sm hover:bg-black hover:text-white transition-all ${
          category === 0 ? "bg-black text-white" : "bg-gray-200"
        }`}
        onClick={() => {
          setCategory(0);
        }}
      >
        전체
      </button>
      {data?.categoryLists &&
        data.categoryLists.map((cat: CategoryType) => (
          <button
            key={cat.id}
            className={`py-2 px-2 font-bold rounded-sm hover:bg-black hover:text-white transition-all ${
              category === cat.id ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setCategory(cat.id);
            }}
          >
            {cat.name}
          </button>
        ))}
    </div>
  );
}
