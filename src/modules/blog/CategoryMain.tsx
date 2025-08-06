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
export default function CategoryMain() {
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data } = useCategoryLists();

  const handleCategory = (val: string) => {
    if (val === "add") {
      setSelectedCategory("");
      setShowCategoryPopup(true);
    } else {
      setSelectedCategory(val);
    }
  };

  return (
    <div>
      <Select
        onValueChange={(value) => handleCategory(value)}
        value={selectedCategory}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category">
            {selectedCategory}
          </SelectValue>
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
