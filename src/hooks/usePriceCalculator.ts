import { useMemo } from 'react';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

export const usePriceCalculator = () => {
  const { selectedTop, selectedLegs, selectedBase, basePrice } = useConfiguratorStore();

  const totalPrice = useMemo(() => {
    let total = basePrice;

    if (selectedTop) {
      total += selectedTop.priceModifier;
    }
    if (selectedLegs) {
      total += selectedLegs.priceModifier;
    }
    if (selectedBase) {
      total += selectedBase.priceModifier;
    }

    return total;
  }, [selectedTop, selectedLegs, selectedBase, basePrice]);

  return totalPrice;
};
