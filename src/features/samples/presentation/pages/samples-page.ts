import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import "@features/samples/presentation/components/bb-timeline";
import type { TimelineItem } from "@features/samples/presentation/components/bb-timeline-item";

const sampleItems: TimelineItem[] = [
  {
    title: "Order placed",
    date: new Date(2026, 4, 28),
    dateFormat: "medium",
    status: "success",
    body: "Payment confirmed.",
  },
  {
    title: "Return requested",
    date: new Date(2026, 5, 1),
    dateFormat: "medium",
    status: "warning",
    body: "Customer opened a return case.",
  },
  {
    title: "Inspection in progress",
    date: new Date(2026, 5, 2),
    dateFormat: "long",
    status: "current",
    body: "Warehouse team is reviewing the items.",
  },
  {
    title: "Refund pending",
    status: "default",
    body: "Waiting for inspection approval.",
  },
];

@customElement("app-samples-page")
export class AppSamplesPage extends LitElement {
  render() {
    return html`
      <main style="padding: 2rem; font-family: system-ui, sans-serif;">
        <bb-timeline heading="Order timeline" .items=${sampleItems}>
        </bb-timeline>
      </main>
    `;
  }
}
