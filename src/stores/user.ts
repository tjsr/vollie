import { PartialUser, User } from "../model/entity";

import { create } from "zustand";
import { organisers } from "../query/organiser";

export const user: PartialUser = {
  id: 1,
  organisations: [organisers[0]]
};


export interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (user: User) => void;
  updateUser: (user: User) => void;
}

export const useUser = create<UserState>((set) => ({
  users: [],
  setUsers: (users: User[]) => set({ users }),
  addUser: (user: User) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (user: User) => set((state) => ({ users: state.users.filter((u: User) => u.id !== user.id) })),
  updateUser: (user: User) => set((state) => ({ users: state.users.map((u: User) => u.id === user.id ? user : u) })),
}));
