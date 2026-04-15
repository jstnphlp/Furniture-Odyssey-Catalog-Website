import { combinationsMap, FALLBACK_IMAGE_URL } from './combinations';

/**
 * Utility function to get the image URL and availability for a specific
 * combination of table top, legs, and base.
 */
export const getImageForCombination = (
  topId: string | undefined,
  legId: string | undefined,
  baseId: string | undefined
) => {
  if (!topId || !legId || !baseId) {
    return {
      imageUrl: FALLBACK_IMAGE_URL,
      summaryText: 'Select a top, legs, and base to see your custom table.',
      isAvailable: true,
    };
  }

  const combinationId = `${topId}-${legId}-${baseId}`;
  const combination = combinationsMap[combinationId];

  if (combination) {
    return combination;
  }

  // If the combination isn't explicitly mocked, return the fallback but assume it's available
  return {
    imageUrl: FALLBACK_IMAGE_URL,
    summaryText: 'Standard custom combination.',
    isAvailable: true,
  };
};
