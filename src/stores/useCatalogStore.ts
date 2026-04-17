import { create } from 'zustand'
import { catalogData } from '../data/catalogData'
import type { Product, CustomizableTable, TableOption } from '../types/catalog'
import { isCustomizableTable } from '../types/catalog'

interface CatalogState {
  products: Array<Product | CustomizableTable>

  // Admin mutations
  addProduct: (product: Product | CustomizableTable) => void
  removeProduct: (id: string) => void
  updateProduct: (id: string, updates: Partial<Pick<Product, 'name' | 'description' | 'dimensions' | 'basePrice' | 'isHomepageFeatured'>>) => void
  updateTableOption: (productId: string, group: 'Top' | 'Legs' | 'Base', optionId: string, updates: Partial<Pick<TableOption, 'priceModifier' | 'available' | 'name'>>) => void
  toggleOptionAvailability: (productId: string, group: 'Top' | 'Legs' | 'Base', optionId: string) => void
}

export const useCatalogStore = create<CatalogState>((set) => ({
  products: catalogData,

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    })),

  updateTableOption: (productId, group, optionId, updates) =>
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== productId || !isCustomizableTable(p)) return p
        return {
          ...p,
          options: {
            ...p.options,
            [group]: p.options[group].map((opt) =>
              opt.id === optionId ? { ...opt, ...updates } : opt,
            ),
          },
        }
      }),
    })),

  toggleOptionAvailability: (productId, group, optionId) =>
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== productId || !isCustomizableTable(p)) return p
        return {
          ...p,
          options: {
            ...p.options,
            [group]: p.options[group].map((opt) =>
              opt.id === optionId
                ? { ...opt, available: !(opt.available ?? true) }
                : opt,
            ),
          },
        }
      }),
    })),
}))
