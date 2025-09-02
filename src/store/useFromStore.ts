import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FromStore {
  from: string;
  setFrom: (value: string) => void;
}

export const useFromStore = create<FromStore>()(
  persist(
    (set) => ({
      from: "",
      setFrom: (value) => set({ from: value }),
    }),
    { name: "from-storage" }
  )
);
