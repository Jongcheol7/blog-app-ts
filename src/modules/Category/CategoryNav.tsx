"use client";
import { Button } from "@/components/ui/button";
import { useCategoryLists } from "@/hooks/useCategoryLists";
import { useFromStore } from "@/store/useFromStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useState } from "react";
import CategoryPopup from "./CategoryPopup";
import { AnimatePresence } from "framer-motion";

export default function CategoryNav() {
  const { data } = useCategoryLists();
  const { from } = useFromStore();
  const { category, setCategory } = useSearchStore();
  const [isCatPopup, setIsCatPopup] = useState(false);

  if (from === "/guestbook" || from === "/about") return;
  return (
    <div className="flex items-center gap-2 pb-3 border-b">
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
        data.categoryLists.map((cat: Category) => (
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
      {from === "/admin" && (
        <Button
          className="bg-gray-200 py-2 px-2"
          onClick={() => setIsCatPopup(!isCatPopup)}
        >
          ⚙️
        </Button>
      )}
      <AnimatePresence>
        {isCatPopup && <CategoryPopup setShow={setIsCatPopup} />}
      </AnimatePresence>
    </div>
  );
}
