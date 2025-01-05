import { RaceEvent } from "../model/entity";
import { create } from "zustand";

export interface EventState {
  events: RaceEvent[];
  setEvents: (events: RaceEvent[]) => void;
  addEvent: (event: RaceEvent) => void;
  removeEvent: (event: RaceEvent) => void;
  updateEvent: (event: RaceEvent) => void;
}

export const useEvent = create<EventState>((set) => ({
  events: [],
  setEvents: (events: RaceEvent[]) => set({ events }),
  addEvent: (event: RaceEvent) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (event: RaceEvent) => set((state) => ({ events: state.events.filter((e: RaceEvent) => e.id !== event.id) })),
  updateEvent: (event: RaceEvent) => set((state) => ({ events: state.events.map((e: RaceEvent) => e.id === event.id ? event : e) })),
}));
