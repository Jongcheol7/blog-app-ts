import { create } from "zustand";

type KeywordStore = {
  keyword: string;
  category: number;
  setKeyword: (value: string) => void;
  setCategory: (value: number) => void;
};

export const useSearchStore = create<KeywordStore>((set) => ({
  keyword: "",
  category: 0,
  setKeyword: (value) => set({ keyword: value }),
  setCategory: (value) => set({ category: value }),
}));
