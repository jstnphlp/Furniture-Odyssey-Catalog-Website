export type ProductCategory = 'Chairs' | 'Tables' | 'Collections'

export type VariationGroup = 'Color' | 'Size'
export type OptionGroupLegacy = 'Top' | 'Legs' | 'Base'
export type OptionGroup = OptionGroupLegacy | VariationGroup

export interface Product {
  id: string
  name: string
  category: ProductCategory
  basePrice: number
  image: string
  description?: string
  dimensions?: string
  badge?: string
  badgeTone?: 'teal' | 'warm' | 'dark'
  isCustomizable: boolean
  features?: string[]
  colorwaysCount?: number
  ctaLabel?: string
  isHomepageFeatured?: boolean
}

export interface TableOption {
  id: string
  name: string
  priceModifier: number
  layerUrl: string
  available?: boolean
  incompatibleWith?: string[]
}

export interface CustomizableTable extends Product {
  category: 'Tables'
  isCustomizable: true
  options: {
    Top: TableOption[]
    Legs: TableOption[]
    Base: TableOption[]
  }
}

/** A product with optional Color and/or Size variations */
export interface ProductVariations {
  colorOptions: TableOption[]
  sizeOptions: TableOption[]
}

export const isCustomizableTable = (
  product: Product | CustomizableTable,
): product is CustomizableTable => product.isCustomizable
