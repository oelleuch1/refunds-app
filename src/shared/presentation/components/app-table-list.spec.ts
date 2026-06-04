import { elementUpdated, expect, fixture, html } from "@open-wc/testing";
import { describe, it } from "vitest";

import "./app-table-list.ts";
import type { AppDataTableColumn } from "./app-table-list.ts";

// Pagination

describe("app-data-table", () => {
  it("does not render an Actions column in the header when actions are not provided", async () => {
    const columns: AppDataTableColumn<{ name: string }>[] = [
      { label: "Name", key: "name" },
    ];

    const el = await fixture(html`
      <app-data-table
        .columns=${columns}
        .rows=${[{ name: "Acme" }]}
      ></app-data-table>
    `);
    await elementUpdated(el);

    const headerLabels = [...el.shadowRoot!.querySelectorAll("thead th")].map(
      (th) => th.textContent?.trim(),
    );

    expect(headerLabels).to.deep.equal(["Name"]);
    expect(headerLabels).to.not.include("Actions");
  });
});

// Rendering the app table with the slot loading will be at the top of the table

describe("app-data-table", () => {
  it("renders the slot loading at the top of the table", async () => {
    const el = await fixture(html`
      <app-data-table>
        <div slot="loading" data-test-id="loadingSlot">Loading...</div>
      </app-data-table>
    `);
    await elementUpdated(el);

    const body = el.shadowRoot!.querySelector("tbody");
    const slot = body.querySelector('slot[name="loading"]');

    expect(slot).to.exist;
  });
});

// Rendering the app table with mocked render row should render row with that method

// Rendering the app table with a slot papgination should be shown over the fallback value of the slot

// Rendering the app table without a slot pagination should show the default fallabck slot

// Rendering the app table without a slot pagination and clicking on the button should raise an event

// For given mock columns (one without render fuction and one with the render function), renderRow function should render my row deciding if the item has render method or not

// Providing some mock actions I should see actions at the last column. When clicking on an icon of an action I should have action menthod to be executed
