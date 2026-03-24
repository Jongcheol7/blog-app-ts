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
    <div className="flex items-center gap-2 pb-6 overflow-x-auto scrollbar-none">
      <button
        className={cn(
          "shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-supanova cursor-pointer",
          category === 0
            ? "bg-foreground text-background shadow-sm"
            : "text-muted-foreground hover:text-foreground"
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
              "shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-supanova cursor-pointer",
              category === cat.id
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
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
