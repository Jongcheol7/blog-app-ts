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
  readYn: boolean;
};
export default function CategoryMain({ category, setCategory, readYn }: Props) {
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

  const selectedCategoryName = (val: number) => {
    return (
      data?.categoryLists.find((cat: CategoryType) => cat.id === val)?.name ||
      ""
    );
  };

  return (
    <div>
      {!readYn ? (
        <select
          onChange={(e) => handleCategory(e.target.value)}
          value={category}
        >
          <option value={"-1"}>Add</option>
          {data?.categoryLists &&
            data?.categoryLists?.map((cat: CategoryType) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
            ))}
        </select>
      ) : (
        <div>{selectedCategoryName(Number(category))}</div>
      )}

      {showCategoryPopup && <CategoryPopup setShow={setShowCategoryPopup} />}
    </div>
  );
}
