import { createClient } from './client'
import type {
  Product,
  ProductCategory,
  ProductColorVariant,
  ProductImage,
} from '../types/catalog'

const supabase = createClient()

const PRODUCT_IMAGE_PLACEHOLDER = '/images/wooden-cabinet.png'
export type CataloguePageKey = 'home' | 'chairs' | 'tables' | 'collections'

export interface CatalogueProduct extends Product {
  code: string | null
  currency: string | null
  websitePages: string[]
  websiteSortOrder: number | null
  primaryImageAlt: string | null
}

export interface CatalogueProductImage {
  id: string
  product_id: string
  color_variant_id?: string | null
  secure_url: string | null
  alt_text: string | null
  sort_order: number | null
  is_primary: boolean | null
}

export interface CatalogueProductColorVariant {
  id: string
  product_id: string
  name: string
  hex: string | null
  sort_order: number | null
  is_active: boolean | null
}

export interface CataloguePageContent {
  id: string
  page: string
  section: string
  field_key: string
  field_value: string
  updated_at: string | null
}

export interface CatalogueTag {
  id: string
  name: string
  created_at: string | null
}

export interface CatalogueProductTag {
  product_id: string
  tag_id: string
  tag_name: string
}

interface CatalogueProductRow {
  id: string
  code: string | null
  name: string
  category: string | null
  description: string | null
  specifications: string | null
  reference_price: number | null
  currency: string | null
  website_pages?: unknown
  website_sort_order: number | null
  primary_image_url: string | null
  primary_image_alt: string | null
}

export function normalizeCatalogueCategory(category: string | null): ProductCategory {
  const normalized = category?.toLowerCase() ?? ''

  if (normalized.includes('chair')) return 'Chairs'
  if (normalized.includes('stool')) return 'Chairs'
  if (normalized.includes('table')) return 'Tables'
  if (normalized.includes('collection')) return 'Collections'
  if (normalized.includes('sofa')) return 'Collections'

  return 'Collections'
}

const normalizeWebsitePages = (websitePages: unknown, productId: string): string[] => {
  if (Array.isArray(websitePages)) {
    return websitePages.filter((page): page is string => typeof page === 'string')
  }

  if (websitePages != null) {
    console.warn(
      `Catalogue product ${productId} has invalid website_pages; defaulting to hidden.`,
    )
  }

  return []
}

export function isVisibleOnPage(
  product: Pick<CatalogueProduct, 'websitePages'>,
  pageKey: CataloguePageKey,
) {
  return Array.isArray(product.websitePages) && product.websitePages.includes(pageKey)
}

const sortProductImages = (images: ProductImage[]) =>
  [...images].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return a.id.localeCompare(b.id)
  })

const sortColorVariants = (variants: ProductColorVariant[]) =>
  [...variants].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return a.id.localeCompare(b.id)
  })

const mapCatalogueProductImage = (row: CatalogueProductImage): ProductImage | null => {
  const secureUrl = row.secure_url?.trim()
  if (!secureUrl) return null

  return {
    id: row.id,
    productId: row.product_id,
    colorVariantId: row.color_variant_id ?? null,
    secureUrl,
    altText: row.alt_text,
    sortOrder: row.sort_order ?? 0,
    isPrimary: Boolean(row.is_primary),
  }
}

const mapCatalogueColorVariant = (
  row: CatalogueProductColorVariant,
): ProductColorVariant => ({
  id: row.id,
  productId: row.product_id,
  name: row.name,
  hex: row.hex,
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
})

const mapCatalogueProduct = (
  row: CatalogueProductRow,
  images: ProductImage[] = [],
  colorVariants: ProductColorVariant[] = [],
): CatalogueProduct => {
  const sortedImages = sortProductImages(images)
  const primaryImage =
    sortedImages.find((image) => image.isPrimary) ?? sortedImages[0] ?? null
  const primaryImageUrl = row.primary_image_url?.trim()
  const imageUrl = primaryImage?.secureUrl ?? primaryImageUrl ?? PRODUCT_IMAGE_PLACEHOLDER

  return {
  id: row.id,
  code: row.code,
  name: row.name,
  category: normalizeCatalogueCategory(row.category),
  basePrice: row.reference_price ?? 0,
  image: imageUrl,
  images: sortedImages,
  colorVariants: sortColorVariants(colorVariants),
  description: row.description ?? undefined,
  dimensions: row.specifications ?? undefined,
  isCustomizable: false,
  features: [],
  websitePages: normalizeWebsitePages(row.website_pages, row.id),
  websiteSortOrder: row.website_sort_order,
  currency: row.currency,
  primaryImageAlt: row.primary_image_alt,
  }
}

export async function getCatalogueProducts(): Promise<CatalogueProduct[]> {
  const { data, error } = await supabase
    .from('public_catalog_products')
    .select(
      [
        'id',
        'code',
        'name',
        'category',
        'description',
        'specifications',
        'reference_price',
        'currency',
        'website_sort_order',
        'website_pages',
        'primary_image_url',
        'primary_image_alt',
      ].join(', '),
    )
    .order('website_sort_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  if (error) {
    if (error.message?.includes('website_pages')) {
      console.warn(
        'public_catalog_products is missing website_pages; products will be hidden until the view is updated.',
      )
    }
    console.error('Failed to load catalogue products:', error)
    return []
  }

  const rows = (data ?? []) as unknown as CatalogueProductRow[]
  const [imageRows, colorVariantRows] = await Promise.all([
    getCatalogueProductImages(),
    getCatalogueProductColorVariants(),
  ])
  const imagesByProductId = new Map<string, ProductImage[]>()
  const variantsByProductId = new Map<string, ProductColorVariant[]>()

  for (const row of imageRows) {
    const image = mapCatalogueProductImage(row)
    if (!image) continue
    const existing = imagesByProductId.get(image.productId) ?? []
    existing.push(image)
    imagesByProductId.set(image.productId, existing)
  }

  for (const row of colorVariantRows) {
    const variant = mapCatalogueColorVariant(row)
    if (!variant.isActive) continue
    const existing = variantsByProductId.get(variant.productId) ?? []
    existing.push(variant)
    variantsByProductId.set(variant.productId, existing)
  }

  return rows.map((row) =>
    mapCatalogueProduct(
      row,
      imagesByProductId.get(row.id) ?? [],
      variantsByProductId.get(row.id) ?? [],
    ),
  )
}

export async function getCatalogueProductImages(): Promise<CatalogueProductImage[]> {
  const { data, error } = await supabase
    .from('public_catalog_product_images')
    .select('id, product_id, color_variant_id, secure_url, alt_text, sort_order, is_primary')
    .order('is_primary', { ascending: false })
    .order('sort_order', { ascending: true, nullsFirst: false })

  if (error) {
    if (error.message?.includes('color_variant_id')) {
      console.warn(
        'public_catalog_product_images is missing color_variant_id; treating all images as general product images.',
      )
      const fallback = await supabase
        .from('public_catalog_product_images')
        .select('id, product_id, secure_url, alt_text, sort_order, is_primary')
        .order('is_primary', { ascending: false })
        .order('sort_order', { ascending: true, nullsFirst: false })

      if (fallback.error) {
        console.error('Failed to load catalogue product images:', fallback.error)
        return []
      }

      return ((fallback.data ?? []) as unknown as CatalogueProductImage[]).map((image) => ({
        ...image,
        color_variant_id: null,
      }))
    }

    console.error('Failed to load catalogue product images:', error)
    return []
  }

  return (data ?? []) as unknown as CatalogueProductImage[]
}

export async function getCatalogueProductColorVariants(): Promise<CatalogueProductColorVariant[]> {
  const { data, error } = await supabase
    .from('public_catalog_product_color_variants')
    .select('id, product_id, name, hex, sort_order, is_active')
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  if (error) {
    console.warn(
      'public_catalog_product_color_variants is unavailable; continuing without product color variations.',
      error,
    )
    return []
  }

  return (data ?? []) as unknown as CatalogueProductColorVariant[]
}

export async function getPageContent(page?: string): Promise<CataloguePageContent[]> {
  let query = supabase
    .from('public_catalog_page_content')
    .select('id, page, section, field_key, field_value, updated_at')
    .order('page', { ascending: true })
    .order('section', { ascending: true })
    .order('field_key', { ascending: true })

  if (page) {
    query = query.eq('page', page)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to load catalogue page content:', error)
    return []
  }

  return (data ?? []) as unknown as CataloguePageContent[]
}

export async function getTags(): Promise<CatalogueTag[]> {
  const { data, error } = await supabase
    .from('public_catalog_tags')
    .select('id, name, created_at')
    .order('name', { ascending: true })

  if (error) {
    console.error('Failed to load catalogue tags:', error)
    return []
  }

  return (data ?? []) as unknown as CatalogueTag[]
}

export async function getProductTags(): Promise<CatalogueProductTag[]> {
  const { data, error } = await supabase
    .from('public_catalog_product_tags')
    .select('product_id, tag_id, tag_name')
    .order('tag_name', { ascending: true })

  if (error) {
    console.error('Failed to load catalogue product tags:', error)
    return []
  }

  return (data ?? []) as unknown as CatalogueProductTag[]
}
