import { create } from 'zustand'
import type { CustomizableTable } from '../types/catalog'

interface ConfiguratorState {
  activeProductId: string | null
  selectedTopId: string | null
  selectedLegsId: string | null
  selectedBaseId: string | null
  setActiveProduct: (product: CustomizableTable) => void
  setSelection: (group: 'Top' | 'Legs' | 'Base', optionId: string) => void
  isOptionIncompatible: (product: CustomizableTable, group: 'Top' | 'Legs' | 'Base', optionId: string) => boolean
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  activeProductId: null,
  selectedTopId: null,
  selectedLegsId: null,
  selectedBaseId: null,

  setActiveProduct: (product) => {
    const state = get()

    if (state.activeProductId === product.id) {
      set({ activeProductId: null })
      return
    }

    const isSwitchingProduct = state.activeProductId !== product.id
    const nextTop = isSwitchingProduct
      ? product.options.Top[0]?.id ?? null
      : state.selectedTopId
    const nextLegs = isSwitchingProduct
      ? product.options.Legs[0]?.id ?? null
      : state.selectedLegsId
    const nextBase = isSwitchingProduct
      ? product.options.Base[0]?.id ?? null
      : state.selectedBaseId

    set({
      activeProductId: product.id,
      selectedTopId: nextTop,
      selectedLegsId: nextLegs,
      selectedBaseId: nextBase,
    })
  },

  setSelection: (group, optionId) => {
    if (group === 'Top') {
      set({ selectedTopId: optionId })
      return
    }

    if (group === 'Legs') {
      set({ selectedLegsId: optionId })
      return
    }

    set({ selectedBaseId: optionId })
  },

  isOptionIncompatible: (_product, group, optionId) => {
    const state = get()

    // Get the option's incompatibleWith list from the product
    const options = _product.options[group]
    const option = options.find((o) => o.id === optionId)
    if (!option?.incompatibleWith?.length) return false

    // Check if any currently selected option is in the incompatible list
    const selectedIds = [state.selectedTopId, state.selectedLegsId, state.selectedBaseId].filter(
      (id): id is string => id !== null,
    )

    return option.incompatibleWith.some((incompatId) => selectedIds.includes(incompatId))
  },
}))
