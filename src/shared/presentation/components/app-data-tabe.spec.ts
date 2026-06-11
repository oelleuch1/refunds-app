import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import { vi, describe, beforeEach, afterEach, it } from "vitest";

import "./app-data-table";

type User = {
  id: number;
  name: string;
  email: string;
};

describe("app-data-table", () => {
  const rows: User[] = [
    {
      id: 1,
      name: "John",
      email: "john@test.com",
    },
    {
      id: 2,
      name: "Jane",
      email: "jane@test.com",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
  ];

  it("renders headers", async () => {
    const el = await fixture(html`
      <app-data-table .rows=${rows} .columns=${columns}></app-data-table>
    `);

    const headers = el.shadowRoot!.querySelectorAll("th");

    expect(headers[0].textContent).to.contain("Name");
    expect(headers[1].textContent).to.contain("Email");
  });

  it("renders rows", async () => {
    const el = await fixture(html`
      <app-data-table .rows=${rows} .columns=${columns}></app-data-table>
    `);

    expect(el.shadowRoot!.querySelectorAll("tbody tr")).to.have.length(2);
  });

  it("renders empty state", async () => {
    const el = await fixture(html`
      <app-data-table .rows=${[]} .columns=${columns}></app-data-table>
    `);

    expect(el.shadowRoot!.textContent).to.contain("No data found");
  });

  it("renders loading state", async () => {
    const el = await fixture(html`
      <app-data-table .loading=${true} .columns=${columns}></app-data-table>
    `);

    expect(el.shadowRoot!.textContent).to.contain("Loading data...");
  });

  it("emits row-click", async () => {
    const el = await fixture(html`
      <app-data-table .rows=${rows} .columns=${columns}></app-data-table>
    `);

    const row = el.shadowRoot!.querySelector("tbody tr")!;

    setTimeout(() => row.click());

    const event = await oneEvent(el, "row-click");

    expect(event.detail.row).to.deep.equal(rows[0]);
  });

  it("renders actions column", async () => {
    const el = await fixture(html`
      <app-data-table
        .rows=${rows}
        .columns=${columns}
        .actions=${[
          {
            label: "View",
            icon: {},
            onClick: () => {},
          },
        ]}
      ></app-data-table>
    `);

    expect(el.shadowRoot!.textContent).to.contain("Actions");
  });

  it("executes action callback", async () => {
    const spy = vi.fn();

    const el = await fixture(html`
      <app-data-table
        .rows=${rows}
        .columns=${columns}
        .actions=${[
          {
            label: "View",
            icon: {},
            onClick: spy,
          },
        ]}
      ></app-data-table>
    `);

    const button = el.shadowRoot!.querySelector("tbody button")!;

    button.click();

    expect(spy.mock.calls).to.have.length(1);
    expect(spy.mock.calls[0][0]).to.deep.equal(rows[0]);
  });

  it("does not emit row-click when action clicked", async () => {
    const rowSpy = vi.fn();

    const el = await fixture(html`
      <app-data-table
        .rows=${rows}
        .columns=${columns}
        .actions=${[
          {
            label: "View",
            icon: {},
            onClick: () => {},
          },
        ]}
      ></app-data-table>
    `);

    el.addEventListener("row-click", rowSpy);

    const button = el.shadowRoot!.querySelector("tbody button")!;

    button.click();

    expect(rowSpy.mock.calls).to.have.length(0);
  });

  it("emits page-change", async () => {
    const el = await fixture(html`
      <app-data-table
        .rows=${rows}
        .columns=${columns}
        .page=${1}
        .pageSize=${10}
        .total=${30}
      ></app-data-table>
    `);

    const buttons = [...el.shadowRoot!.querySelectorAll("button")];

    const page2 = buttons.find((btn) => btn.textContent?.trim() === "2")!;

    setTimeout(() => page2.click());

    const event = await oneEvent(el, "page-change");

    expect(event.detail.page).to.equal(2);
  });

  it("hides pagination when only one page exists", async () => {
    const el = await fixture(html`
      <app-data-table
        .rows=${rows}
        .columns=${columns}
        .total=${2}
        .pageSize=${10}
      ></app-data-table>
    `);

    expect(el.shadowRoot!.textContent).not.to.contain("Showing");
  });
});
