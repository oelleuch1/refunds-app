import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import { Search, Eye, Trash } from "lucide";

import "@shared/presentation/components/app-data-table";
import "@shared/presentation/components/app-icon";
import { ordersStore } from "../stores/orders.store";

import "@shared/presentation/components/app-form";
import "@shared/presentation/components/app-stepper";

export type Order = {
  id: string;
  customer_id: string;
  total_amount: number;
  delivery_status: string;
  created_at: string;
};

@customElement("app-orders-page")
export class OrdersPage extends LitElement {
  static styles = [tailwindStyles];

  protected async firstUpdated(): Promise<void> {
    await ordersStore.getOrders();
    this.requestUpdate();
  }

  private async updatePage(newPage: number) {
    await ordersStore.updatePage(newPage);
    this.requestUpdate();
  }

  @state()
  private steps = [
    { title: "Select item", info: "Choose item" },
    { title: "Reason", info: "Choose item" },
    { title: "Explanation", info: "Choose item" },
  ];

  @state()
  private currentStep = 0;

  protected render() {
    return html`
      <app-stepper
        .steps=${this.steps}
        .currentStep=${this.currentStep}
      ></app-stepper>

      <div
        class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        <!-- Header -->
        <header>
          <h1 class="text-3xl font-bold text-text-primary tracking-tight mb-2">
            Orders
          </h1>
          <p class="text-text-dim">All customer orders across the platform</p>
        </header>

        <!-- Search & Filters (Optional but good for consistency) -->
        <div
          class="bg-surface-panel/40 border border-white/5 rounded-2xl p-6 mb-1 shadow-sm flex gap-3"
        >
          <div class="relative flex-1 group">
            <div
              class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-dim group-focus-within:text-brand-light transition-colors"
            >
              <app-icon .icon=${Search} .size=${18}></app-icon>
            </div>
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              class="w-full bg-surface-card border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:border-brand-light/30 focus:bg-surface-card/60 transition-all"
            />
          </div>
          <button
            class="bg-brand hover:bg-brand-dark text-white px-6 py-3.5 rounded-xl flex items-center gap-2 font-semibold shadow-brand transition-all active:scale-95"
          >
            <app-icon .icon=${Search} .size=${18} stroke-width="2.5"></app-icon>
            Filter
          </button>
        </div>

        <!-- Data Table -->
        <app-data-table
          .rows=${ordersStore.state.orders}
          .columns=${[
            { key: "id", label: "Order ID" },
            { key: "customer_id", label: "Customer ID" },
            {
              key: "total_amount",
              label: "Total Amount",
              render: (row) => `$${row.total_amount.toFixed(2)}`,
            },
            {
              key: "delivery_status",
              label: "Delivery Status",
              render: (row) => html`
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium ${row.delivery_status ===
                  "Delivered"
                    ? "bg-green-100 text-green-800"
                    : row.delivery_status === "In Transit"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"}"
                >
                  ${row.delivery_status}</span
                >
              `,
            },
            {
              key: "created_at",
              label: "Created At",
              render: (row) => new Date(row.created_at).toLocaleDateString(),
            },
          ]}
          .actions=${[
            {
              label: "View Details",
              icon: Eye,
              onClick: (row) => {
                console.log("View details for order:", row);
              },
            },
            {
              label: "Delete",
              icon: Trash,
              onClick: (row) => {
                console.log("Delete order:", row);
              },
            },
          ]}
          .loading=${ordersStore.state.isLoading}
          .page=${ordersStore.state.currentPage}
          .total=${ordersStore.state.totalOrders}
          .pageSize=${ordersStore.state.pageSize}
          @page-change=${(e: CustomEvent) => this.updatePage(e.detail.page)}
        >
        </app-data-table>
      </div>
      <app-form
        .fields=${[
          [
            {
              name: "order_id",
              label: "Order ID",
              type: "text",
              attrs: { readonly: true, value: "12345" },
              rules: [],
            },
            {
              name: "reason",
              label: "Reason for Return",
              type: "select",
              attrs: {
                options: [
                  { value: "defective", label: "Defective Item" },
                  { value: "wrong_item", label: "Wrong Item Sent" },
                  { value: "no_longer_needed", label: "No Longer Needed" },
                  { value: "other", label: "Other" },
                ],
              },
              rules: [
                {
                  type: "required",
                  message: "Please select a reason for return.",
                },
              ],
            },
          ],
        ]}
      ></app-form>
    `;
  }
}
