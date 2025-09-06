import { useState } from "react";
import { useCategoryLists } from "@/hooks/useCategoryLists";
import CategoryPopup from "./CategoryPopup";

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

  console.log("카테고리메인 category :", category);

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
      <select
        onChange={(e) => handleCategory(e.target.value)}
        value={category}
        className="text-xl border py-1 px-1 font-bold"
        disabled={readYn}
      >
        <option value={"-1"}>Add</option>
        {data?.categoryLists &&
          data?.categoryLists?.map((cat: CategoryType) => (
            <option key={cat.id} value={String(cat.id)} className="">
              {cat.name}
            </option>
          ))}
      </select>
      {showCategoryPopup && <CategoryPopup setShow={setShowCategoryPopup} />}
    </div>
  );
}
