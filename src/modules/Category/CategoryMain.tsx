"use client";

import { useState } from "react";
import { useCategoryLists } from "@/hooks/useCategoryLists";
import CategoryPopup from "./CategoryPopup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  category: string;
  setCategory: (val: string) => void;
  readYn: boolean;
};

export default function CategoryMain({ category, setCategory, readYn }: Props) {
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { data } = useCategoryLists();

  const handleCategory = (val: string) => {
    if (val === "-1") {
      setCategory("");
      setShowCategoryPopup(true);
    } else {
      setCategory(val);
    }
  };

  return (
    <div>
      <Select
        value={category}
        onValueChange={handleCategory}
        disabled={readYn}
      >
        <SelectTrigger className="w-[180px] rounded-lg font-semibold">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-1">Settings</SelectItem>
          {data?.categoryLists &&
            data?.categoryLists?.map((cat: Category) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {showCategoryPopup && (
        <CategoryPopup setShow={setShowCategoryPopup} />
      )}
    </div>
  );
}
