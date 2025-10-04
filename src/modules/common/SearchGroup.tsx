import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/useSearchStore";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  setSearchClick: (val: boolean) => void;
};

export default function SearchGroup({ setSearchClick }: Props) {
  const { keyword, setKeyword } = useSearchStore();
  const keywordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (keyword === "") {
      if (keywordRef.current) keywordRef.current.value = "";
    }
  }, [keyword]);

  return (
    <motion.div>
      <motion.div
        className="fixed z-50 left-1/2 -translate-x-1/2  top-1/2 -translate-y-1/2
                w-[450px] flex gap-1 text-gray-300 bg-gray-100 p-7 rounded-2xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Input
          className="text-gray-700 font-bold bg-white"
          type="text"
          placeholder="Search"
          ref={keywordRef}
          defaultValue={keyword}
        />
        <button
          className="cursor-pointer border rounded-lg p-1 bg-white text-gray-400 hover:text-white hover:bg-black transition-all"
          onClick={() => {
            setKeyword(keywordRef.current?.value || "");
            setSearchClick(false);
          }}
        >
          <Search />
        </button>
      </motion.div>
      <motion.div
        className="fixed z-40 inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setSearchClick(false)}
      />
    </motion.div>
  );
}
