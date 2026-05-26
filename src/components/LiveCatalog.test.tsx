// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImgHTMLAttributes } from "react";

interface QueryMock<TData = unknown[]> extends PromiseLike<{ data: TData; error: null }> {
  select: (...args: unknown[]) => QueryMock<TData>;
  eq: (...args: unknown[]) => QueryMock<TData>;
  in: (...args: unknown[]) => QueryMock<TData>;
  order: (...args: unknown[]) => QueryMock<TData>;
  catch: Promise<{ data: TData; error: null }>["catch"];
  finally: Promise<{ data: TData; error: null }>["finally"];
}

interface ChannelMock {
  on: (event: string, config: { table: string; filter?: string }, callback: () => void) => ChannelMock;
  subscribe: () => ChannelMock;
}

interface CartStoreMock {
  addItem: ReturnType<typeof vi.fn>;
  openCart: ReturnType<typeof vi.fn>;
}

const { channelHandlers, mockSupabase, productRows } = vi.hoisted(() => {
  const channelHandlers: Array<{ table: string; filter?: string }> = [];
  const productRows: unknown[] = [];

  const mockSupabase = {
    from: vi.fn((table: string) => {
      if (table === "public_catalog_products") return makeQuery(productRows);
      if (table === "public_catalog_product_tags") return makeQuery([]);
      return makeQuery([]);
    }),
    channel: vi.fn(() => {
      const channel: ChannelMock = {
        on: vi.fn((_event: string, config: { table: string; filter?: string }) => {
          channelHandlers.push({ table: config.table, filter: config.filter });
          return channel;
        }),
        subscribe: vi.fn(() => channel),
      };
      return channel;
    }),
    removeChannel: vi.fn(() => Promise.resolve()),
  };

  return { channelHandlers, mockSupabase, productRows };
});

import { LiveCatalog } from "./LiveCatalog";

function makeQuery<TData = unknown[]>(data: TData): QueryMock<TData> {
  const promise = Promise.resolve({ data, error: null });
  const query = {
    select: () => query,
    eq: () => query,
    in: () => query,
    order: () => query,
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  } as QueryMock<TData>;
  return query;
}

vi.mock("../lib/client", () => ({
  createClient: () => mockSupabase,
}));

vi.mock("./ProductModal", () => ({
  ProductModal: () => null,
}));

vi.mock("./FilterBar", () => ({
  FilterBar: () => null,
}));

vi.mock("./ProgressiveImage", () => ({
  ProgressiveImage: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock("../stores/useCartStore", () => ({
  useCartStore: (selector: (state: CartStoreMock) => unknown) =>
    selector({
      addItem: vi.fn(),
      openCart: vi.fn(),
    }),
}));

describe("LiveCatalog realtime subscriptions", () => {
  beforeEach(() => {
    channelHandlers.length = 0;
    productRows.length = 0;
    mockSupabase.from.mockClear();
    mockSupabase.channel.mockClear();
    mockSupabase.removeChannel.mockClear();
  });

  it("subscribes to product, image, tag assignment, and tag changes for live refresh", async () => {
    render(<LiveCatalog category="Chairs" pageKey="chairs" />);

    await waitFor(() => {
      expect(channelHandlers).toEqual([
        { table: "Product", filter: undefined },
        { table: "ProductImage", filter: undefined },
        { table: "product_tag_assignments", filter: undefined },
        { table: "tags", filter: undefined },
      ]);
    });
  });

  it("shows only products assigned to the current page", async () => {
    productRows.push(
      {
        id: "chair-on-chairs",
        code: "C-1",
        name: "Visible Chair",
        category: "Tables",
        description: null,
        specifications: null,
        reference_price: 1200,
        currency: "PHP",
        website_sort_order: 1,
        website_pages: ["chairs"],
        primary_image_url: "/visible.png",
        primary_image_alt: null,
      },
      {
        id: "chair-hidden",
        code: "C-2",
        name: "Hidden Chair",
        category: "Chairs",
        description: null,
        specifications: null,
        reference_price: 900,
        currency: "PHP",
        website_sort_order: 2,
        website_pages: [],
        primary_image_url: "/hidden.png",
        primary_image_alt: null,
      },
    );

    render(<LiveCatalog category="Chairs" pageKey="chairs" />);

    expect(await screen.findByText("Visible Chair")).toBeTruthy();
    expect(screen.queryByText("Hidden Chair")).toBeNull();
  });
});
