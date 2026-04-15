export interface Top {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Leg {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Base {
  id: string;
  name: string;
  priceModifier: number;
}

export interface CombinationData {
  imageUrl: string;
  summaryText: string;
  isAvailable: boolean;
}
