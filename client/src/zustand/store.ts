import type { UserType } from "@/types";
import { create } from "zustand";

type QueryStoreType = {
  query: string;
  setQuery: (val: string) => void;
};

export const useQueryStore = create<QueryStoreType>((set) => ({
  query: "",
  setQuery: (val) => set({ query: val }),
}));

type UserStoreType = {
  user: UserType | null;
  setUser: (val: UserType) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  setUser: (val) => set({ user: val }),
  clearUser: () => set({ user: null }),
}));
