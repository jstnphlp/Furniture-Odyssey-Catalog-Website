// @vitest-environment jsdom

import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { channelHandlers, mockSupabase } = vi.hoisted(() => {
  const channelHandlers: Array<{ table: string; filter?: string }> = [];

  const mockSupabase = {
    from: vi.fn((table: string) => {
      if (table === "products") return makeQuery([]);
      if (table === "table_options") return makeQuery([]);
      if (table === "product_tag_assignments") return makeQuery([]);
      return makeQuery([]);
    }),
    channel: vi.fn(() => {
      const channel: any = {
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

function makeQuery(data: any[] = []) {
  const promise = Promise.resolve({ data, error: null });
  const query: any = {
    select: () => query,
    eq: () => query,
    in: () => query,
    order: () => query,
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  };
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
  ProgressiveImage: (props: any) => <img {...props} />,
}));

vi.mock("../stores/useCartStore", () => ({
  useCartStore: (selector: any) =>
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
