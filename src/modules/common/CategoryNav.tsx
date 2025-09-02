"use client";
import { useCategoryLists } from "@/hooks/useCategoryLists";
import { useFromStore } from "@/store/useFromStore";
import { useState } from "react";

type CategoryType = {
  id: string;
  name: string;
};

export default function CategoryNav() {
  const { data } = useCategoryLists();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const { from } = useFromStore();

  if (from === "/guestbook") {
    console.log("방명록 진입.. ");
    return;
  }
  console.log("from : ", from);
  console.log("카테고리네브 data :", data);
  return (
    <div className="flex gap-2 mb-2">
      <button
        className={`py-2 px-2 bg-gray-200 font-bold rounded-sm hover:bg-green-600 ${
          selectedCategory === "전체" ? "bg-green-600" : "bg-gray-200"
        }`}
        onClick={() => setSelectedCategory("전체")}
      >
        전체
      </button>
      {data?.categoryLists &&
        data.categoryLists.map((cat: CategoryType) => (
          <button
            key={cat.id}
            className={`py-2 px-2 bg-gray-200 font-bold rounded-sm hover:bg-green-600 ${
              selectedCategory === cat.name ? "bg-green-600" : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
    </div>
  );
}
