import { PartialSeries } from "../model/entity";
import { create } from "zustand";

export interface SeriesState {
  series: PartialSeries[];
  setSeries: (series: PartialSeries[]) => void;
  addSeries: (series: PartialSeries) => void;
  removeSeries: (series: PartialSeries) => void;
  updateSeries: (series: PartialSeries) => void;
}

export const useSeries = create<SeriesState>((set) => ({
  series: [],
  setSeries: (series: PartialSeries[]) => set({ series }),
  addSeries: (series: PartialSeries) => set((state) => ({ series: [...state.series, series] })),
  removeSeries: (series: PartialSeries) => set((state) => ({ series: state.series.filter((s: PartialSeries) => s.id !== series.id) })),
  updateSeries: (series: PartialSeries) => set((state) => ({ series: state.series.map((s: PartialSeries) => s.id === series.id ? series : s) })),
}));