import { create } from 'zustand';
import { Top, Leg, Base } from '../types';

interface ConfiguratorState {
  selectedTop: Top | null;
  selectedLegs: Leg | null;
  selectedBase: Base | null;
  basePrice: number;
  setSelectedTop: (top: Top | null) => void;
  setSelectedLegs: (legs: Leg | null) => void;
  setSelectedBase: (base: Base | null) => void;
  setBasePrice: (price: number) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  selectedTop: null,
  selectedLegs: null,
  selectedBase: null,
  basePrice: 500, // Default base price
  setSelectedTop: (top) => set({ selectedTop: top }),
  setSelectedLegs: (legs) => set({ selectedLegs: legs }),
  setSelectedBase: (base) => set({ selectedBase: base }),
  setBasePrice: (price) => set({ basePrice: price }),
}));
