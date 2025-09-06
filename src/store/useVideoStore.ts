import { create } from "zustand";

type VideoStore = {
  files: Record<string, File>;
  addFile: (tempId: string, file: File) => void;
  getFile: (tempId: string) => File | undefined;
  removeFile: (tempId: string) => void;
  clearFiles: () => void;
};

export const useVideoStore = create<VideoStore>((set, get) => ({
  files: {},
  addFile: (tempId, file) =>
    set((state) => ({ files: { ...state.files, [tempId]: file } })),
  getFile: (tempId) => get().files[tempId],
  removeFile: (tempId) =>
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[tempId];
      return { files: newFiles };
    }),
  clearFiles: () => set({ files: {} }),
}));
