// @vitest-environment jsdom

import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImgHTMLAttributes } from "react";

interface QueryMock<TData = unknown[]> extends PromiseLike<{ data: TData; error: null }> {
  select: () => QueryMock<TData>;
  eq: () => QueryMock<TData>;
  in: () => QueryMock<TData>;
  order: () => QueryMock<TData>;
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

const { channelHandlers, mockSupabase } = vi.hoisted(() => {
  const channelHandlers: Array<{ table: string; filter?: string }> = [];

  const mockSupabase = {
    from: vi.fn((table: string) => {
      if (table === "products") return makeQuery([]);
      if (table === "product_tag_assignments") return makeQuery([]);
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

  return { channelHandlers, mockSupabase };
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
    mockSupabase.from.mockClear();
    mockSupabase.channel.mockClear();
    mockSupabase.removeChannel.mockClear();
  });

  it("subscribes to product, tag assignment, and tag changes for live refresh", async () => {
    render(<LiveCatalog category="Chairs" />);

    await waitFor(() => {
      expect(channelHandlers).toEqual([
        { table: "products", filter: "category=eq.Chairs" },
        { table: "product_tag_assignments", filter: undefined },
        { table: "tags", filter: undefined },
      ]);
    });
  });
});
