import { fixture, html, expect } from "@open-wc/testing";
import { describe, beforeEach, afterEach, it, vi } from "vitest";

import "./orders-page";
import { ordersStore } from "../stores/orders.store";

describe("orders-page", () => {
  beforeEach(() => {
    vi.spyOn(ordersStore, "getOrders").mockResolvedValue(undefined);

    vi.spyOn(ordersStore, "updatePage").mockResolvedValue(undefined);

    ordersStore.state = {
      orders: [
        {
          id: "1",
          customer_id: "CUST-1",
          total_amount: 120,
          delivery_status: "Delivered",
          created_at: "2026-01-01",
        },
      ],
      isLoading: false,
      currentPage: 1,
      totalOrders: 20,
      pageSize: 10,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads orders on firstUpdated", async () => {
    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    await el.updateComplete;

    expect((ordersStore.getOrders as ReturnType<typeof vi.spyOn>).mock.calls).to.have.length(1);
  });

  it("renders page title", async () => {
    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    expect(el.shadowRoot?.textContent).to.contain("Orders");
    expect(el.shadowRoot?.textContent).to.contain(
      "All customer orders across the platform",
    );
  });

  it("passes store data to data table", async () => {
    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    const table = el.shadowRoot?.querySelector("app-data-table") as any;

    expect(table).to.exist;
    expect(table.rows).to.have.length(1);
    expect(table.rows[0].id).to.equal("1");
    expect(table.rows[0].customer_id).to.equal("CUST-1");
  });

  it("updates page when page-change emitted", async () => {
    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    const table = el.shadowRoot?.querySelector("app-data-table");

    expect(table).to.exist;

    table!.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { page: 3 },
        bubbles: true,
        composed: true,
      }),
    );

    await Promise.resolve();
    await el.updateComplete;

    expect((ordersStore.updatePage as ReturnType<typeof vi.spyOn>).mock.calls).to.have.length(1);
    expect((ordersStore.updatePage as ReturnType<typeof vi.spyOn>).mock.calls[0][0]).to.equal(3);
  });

  it("passes loading state to table", async () => {
    ordersStore.state.isLoading = true;

    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    const table = el.shadowRoot?.querySelector("app-data-table") as any;

    expect(table.loading).to.equal(true);
  });

  it("passes pagination props to table", async () => {
    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    const table = el.shadowRoot?.querySelector("app-data-table") as any;

    expect(table.page).to.equal(1);
    expect(table.total).to.equal(20);
    expect(table.pageSize).to.equal(10);
  });

  it("renders app-form", async () => {
    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    const form = el.shadowRoot?.querySelector("app-form");

    expect(form).to.exist;
  });

  it("renders search input", async () => {
    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    const input = el.shadowRoot?.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement;

    expect(input).to.exist;
    expect(input.placeholder).to.equal(
      "Search by order ID or customer name...",
    );
  });

  it("passes orders loading state from store", async () => {
    ordersStore.state = {
      ...ordersStore.state,
      orders: [],
      isLoading: true,
    };

    const el = await fixture(html` <app-orders-page></app-orders-page> `);

    const table = el.shadowRoot?.querySelector("app-data-table") as any;

    expect(table.loading).to.equal(true);
    expect(table.rows).to.have.length(0);
  });
});
