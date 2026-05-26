import { createClient } from './client'
import type { Product, ProductCategory } from '../types/catalog'

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
  secure_url: string | null
  alt_text: string | null
  sort_order: number | null
  is_primary: boolean | null
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

const mapCatalogueProduct = (row: CatalogueProductRow): CatalogueProduct => ({
  id: row.id,
  code: row.code,
  name: row.name,
  category: normalizeCatalogueCategory(row.category),
  basePrice: row.reference_price ?? 0,
  image: row.primary_image_url ?? PRODUCT_IMAGE_PLACEHOLDER,
  description: row.description ?? undefined,
  dimensions: row.specifications ?? undefined,
  isCustomizable: false,
  features: [],
  websitePages: normalizeWebsitePages(row.website_pages, row.id),
  websiteSortOrder: row.website_sort_order,
  currency: row.currency,
  primaryImageAlt: row.primary_image_alt,
})

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

  return ((data ?? []) as unknown as CatalogueProductRow[]).map(mapCatalogueProduct)
}

export async function getCatalogueProductImages(): Promise<CatalogueProductImage[]> {
  const { data, error } = await supabase
    .from('public_catalog_product_images')
    .select('id, product_id, secure_url, alt_text, sort_order, is_primary')
    .order('sort_order', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Failed to load catalogue product images:', error)
    return []
  }

  return (data ?? []) as unknown as CatalogueProductImage[]
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
