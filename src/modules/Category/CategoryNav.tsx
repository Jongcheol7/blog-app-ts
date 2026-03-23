"use client";
import { Button } from "@/components/ui/button";
import { useCategoryLists } from "@/hooks/useCategoryLists";
import { useFromStore } from "@/store/useFromStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useState } from "react";
import CategoryPopup from "./CategoryPopup";
import { AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoryNav() {
  const { data } = useCategoryLists();
  const { from } = useFromStore();
  const { category, setCategory } = useSearchStore();
  const [isCatPopup, setIsCatPopup] = useState(false);

  if (from === "/guestbook" || from === "/about") return;
  return (
    <div className="flex items-center gap-2 pb-4 border-b border-border overflow-x-auto scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <button
        className={cn(
          "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground",
          category === 0
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-secondary-foreground"
        )}
        onClick={() => setCategory(0)}
      >
        All
      </button>
      {data?.categoryLists &&
        data.categoryLists.map((cat: Category) => (
          <button
            key={cat.id}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
              "hover:bg-accent hover:text-accent-foreground",
              category === cat.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground"
            )}
            onClick={() => setCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      {from === "/admin" && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setIsCatPopup(!isCatPopup)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      )}
      <AnimatePresence>
        {isCatPopup && <CategoryPopup setShow={setIsCatPopup} />}
      </AnimatePresence>
    </div>
  );
}
