import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import type { TimelineItem } from "@features/samples/presentation/components/bb-timeline";
import "@features/samples/presentation/components/bb-timeline";

const sampleItems: TimelineItem[] = [
  {
    title: "Order placed",
    date: new Date(2026, 4, 28),
    body: "Payment confirmed.",
  },
  {
    title: "Return requested",
    date: new Date(2026, 5, 1),
    body: "Customer opened a return case.",
  },
  {
    title: "Inspection in progress",
    date: new Date(2026, 5, 2),
    body: "Warehouse team is reviewing the items. Priority handling enabled.",
  },
  {
    title: "Refund pending",
    body: "Waiting for inspection approval.",
  },
];

@customElement("app-samples-page")
export class AppSamplesPage extends LitElement {
  render() {
    return html`
      <main style="padding: 2rem; font-family: system-ui, sans-serif;">
        <bb-timeline heading="Order timeline" .items=${sampleItems}>
          <p>Contact support if any step looks incorrect.</p>
        </bb-timeline>
      </main>
    `;
  }
}
