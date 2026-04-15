import { CombinationData } from '../types';

// Mock data structure mapping combination IDs to product details.
// ID format: `${topId}-${legId}-${baseId}`
export const combinationsMap: Record<string, CombinationData> = {
  'top-glass-leg-metal-base-wood': {
    imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800',
    summaryText: 'A modern glass top with sturdy metal legs and a warm wooden frame.',
    isAvailable: true,
  },
  'top-wood-leg-wood-base-wood': {
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-028ea62eb36c?auto=format&fit=crop&q=80&w=800',
    summaryText: 'A classic all-wood design featuring solid oak components.',
    isAvailable: true,
  },
  // Incompatible combo example
  'top-marble-leg-plastic-base-metal': {
    imageUrl: '',
    summaryText: 'This combination is currently not supported due to weight constraints.',
    isAvailable: false,
  },
};

// Fallback image url for when a specific combination hasn't been mocked up
export const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800';
