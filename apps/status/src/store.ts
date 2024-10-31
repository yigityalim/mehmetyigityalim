import { create } from "zustand";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { type Incident, mockIncidents } from "./mocks/incident";

export interface Store {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  resetMonth: () => void;
  getCurrentMonth: (state: Store) => Date;
  filteredIncidents: () => Incident[];
}

export const useStore = create<Store>()((set, get) => ({
  currentMonth: new Date(),
  setCurrentMonth: (date) => set({ currentMonth: date }),
  nextMonth: () =>
    set((state) => ({ currentMonth: addMonths(state.currentMonth, 1) })),
  prevMonth: () =>
    set((state) => ({ currentMonth: subMonths(state.currentMonth, 1) })),
  resetMonth: () => set({ currentMonth: new Date() }),
  getCurrentMonth: (state) => state.currentMonth,
  filteredIncidents: () => {
    const start = startOfMonth(get().currentMonth);
    const end = endOfMonth(get().currentMonth);
    return mockIncidents.filter((incident) => {
      const createdAt = new Date(incident.created_at);
      return createdAt >= start && createdAt <= end;
    });
  },
}));
