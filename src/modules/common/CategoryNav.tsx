"use client";
import { useCategoryLists } from "@/hooks/useCategoryLists";
import { useFromStore } from "@/store/useFromStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useState } from "react";

type CategoryType = {
  id: number;
  name: string;
};

export default function CategoryNav() {
  const { data } = useCategoryLists();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const { from } = useFromStore();
  const { setCategory } = useSearchStore();
  console.log("CategoryNav data :", data);
  console.log("categoryNav from :", from);
  console.log("categoryNav selectedCategory :", selectedCategory);
  if (from === "/guestbook" || from === "/about") return;
  return (
    <div className="flex gap-2 pb-3 border-b">
      <button
        className={`py-2 px-2 font-bold rounded-sm hover:bg-black hover:text-white transition-all ${
          selectedCategory === "전체" ? "bg-black text-white" : "bg-gray-200"
        }`}
        onClick={() => {
          setSelectedCategory("전체");
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
              selectedCategory === cat.name
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
            onClick={() => {
              setSelectedCategory(cat.name);
              setCategory(cat.id);
            }}
          >
            {cat.name}
          </button>
        ))}
    </div>
  );
}
