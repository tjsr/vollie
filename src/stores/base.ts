export interface State<T> {
  items: T[];
  set: (all: T[]) => void;
  add: (item: T) => void;
  remove: (item: T) => void;
  update: (item: T) => void;
}


// export const useOrganisation = create<T>((set) => ({
//   items: [],
//   set: (items: T[]) => set({ items }),
//   add: (item: T) => set((state) => ({ items: [...state.items, organisation] })),
//   remove: (item: T) => set((state) => ({ items: state.items.filter((i: T) => org.id !== organisation.id) })),
//   update: (item: T) => set((state) => ({ items: state.items.map((i: T) => org.id === organisation.id ? organisation : org) })),
// }));
