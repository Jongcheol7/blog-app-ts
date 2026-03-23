import { create } from "zustand";

type KeywordStore = {
  keyword: string;
  category: number;
  tag: string;
  setKeyword: (value: string) => void;
  setCategory: (value: number) => void;
  setTag: (value: string) => void;
};

export const useSearchStore = create<KeywordStore>((set) => ({
  keyword: "",
  category: 0,
  tag: "",
  setKeyword: (value) => set({ keyword: value }),
  setCategory: (value) => set({ category: value }),
  setTag: (value) => set({ tag: value }),
}));
