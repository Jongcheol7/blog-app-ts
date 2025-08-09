import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    console.log("핸들카테고리 실행됨 : ", val);
    if (val === "-1") {
      setCategory("");
      setShowCategoryPopup(true);
    } else {
      setCategory(val);
    }
  };

  const selectedCategoryName =
    data?.categoryLists.find((cat: CategoryType) => String(cat.id) === category)
      ?.name || "";

  return (
    <div>
      <Select onValueChange={(value) => handleCategory(value)} value={category}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category">
            {selectedCategoryName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-1">Add</SelectItem>
          {data?.categoryLists &&
            data?.categoryLists?.map((cat: CategoryType) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {showCategoryPopup && <CategoryPopup setShow={setShowCategoryPopup} />}
    </div>
  );
}
