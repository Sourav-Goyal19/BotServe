import { create } from "zustand";

type QueryStoreType = {
  query: string;
  setQuery: (val: string) => void;
};

export const useQueryStore = create<QueryStoreType>((set) => ({
  query: "",
  setQuery: (val) => set({ query: val }),
}));
