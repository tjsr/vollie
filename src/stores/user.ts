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
  addOrUpdateUsers: (updatedUsers: User[]) => void;
}

export const useUser = create<UserState>((set) => ({
  users: [],
  setUsers: (users: User[]) => set({ users }),
  addUser: (user: User) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (user: User) => set((state) => ({ users: state.users.filter((u: User) => u.id !== user.id) })),
  updateUser: (user: User) => set((state) => ({ users: state.users.map((u: User) => u.id === user.id ? user : u) })),

  addOrUpdateUsers: (updatedUsers: User[]): void => set((state) => {
    const existingIds = state.users.map((u: User) => u.id);
    const updatedIds = updatedUsers.map((u: User) => u.id)
    const addedIds = updatedIds.filter((id) => !existingIds.includes(id));
    const addedUsers = updatedUsers.filter((u: User) => addedIds.includes(u.id));
    let updated = addedIds.length > 0;

    const outputUsers = state.users.map((u: User) => {
      const found = updatedUsers.find((updated) => updated.id === u.id);
      if (!updated && found && JSON.stringify(found) !== JSON.stringify(u)) {
        updated = true;
      }
      return found || u;
    });
    outputUsers.push(...addedUsers);
    if (updated) {
      return { users: outputUsers }
    } else {
      // No change, so don't trigger a re-render
      return state;
    }
  })
}));
