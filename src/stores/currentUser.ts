import { User } from "../model/entity";
import { create } from "zustand";

export interface CurrentUserState {
  currentUser: User | null;
  setCurrentUser: (currentUser: User) => void;
}

export const useCurrentUser = create<CurrentUserState>((set) => ({
  currentUser: {
    id: 1051,
    email: "tim@tjsr.id.au",
    firstName: "Tim",
    lastName: "Rowe",
    phone: "0400000000",
    organisations: [],
  },
  setCurrentUser: (currentUser: User) => set({ currentUser }),
}));
