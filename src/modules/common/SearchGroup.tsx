import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/useSearchStore";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

export default function SearchGroup() {
  const { keyword, setKeyword } = useSearchStore();
  const keywordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (keyword === "") {
      if (keywordRef.current) keywordRef.current.value = "";
    }
  }, [keyword]);

  return (
    <div className="w-[250px] flex gap-1 text-gray-300">
      <Input
        className="text-gray-700 font-bold"
        type="text"
        placeholder="Search"
        ref={keywordRef}
      />
      <button
        className="cursor-pointer border rounded-lg p-1 text-gray-400 hover:text-white hover:bg-black transition-all"
        onClick={() => {
          setKeyword(keywordRef.current?.value || "");
        }}
      >
        <Search />
      </button>
    </div>
  );
}
