"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-popover border border-border rounded-2xl shadow-2xl p-6 space-y-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xl font-semibold text-center">Category Settings</p>

        <Input
          className="rounded-lg"
          placeholder="New category name"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddCategory(inputRef.current?.value ?? "");
            }
          }}
        />

        <div className="flex flex-wrap gap-2">
          {data?.categoryLists &&
            data.categoryLists.map((cat: Category) => (
              <button
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                key={cat.id}
                onClick={() => deleteMutate(cat.name)}
              >
                {cat.name}
              </button>
            ))}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleAddCategory(inputRef.current?.value ?? "")}
            disabled={savePending}
          >
            {savePending ? "Adding..." : "Add"}
          </Button>
        </div>
      </motion.div>
      <motion.div
        className="fixed inset-0 z-40 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setShow(false)}
      />
    </div>
  );
}
