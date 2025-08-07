import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { useState } from "react";
import CategoryPopup from "./CategoryPopup";
import { useCategoryLists } from "@/hooks/useCategoryLists";

type CategoryType = {
  id: number;
  name: string;
  parentId?: number;
};

type Props = {
  category: string;
  setCategory: (val: string) => void;
};
export default function CategoryMain({ category, setCategory }: Props) {
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { data } = useCategoryLists();

  const handleCategory = (val: string) => {
    if (val === "add") {
      setCategory("");
      setShowCategoryPopup(true);
    } else {
      setCategory(val);
    }
  };

  return (
    <div>
      <Select onValueChange={(value) => handleCategory(value)} value={category}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category">{category}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="add">Add</SelectItem>
          {data?.categoryLists &&
            data?.categoryLists?.map((cat: CategoryType) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {showCategoryPopup && <CategoryPopup setShow={setShowCategoryPopup} />}
    </div>
  );
}
