import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { tailwindStyles } from "@styles/tailwind-styles";
import { ChevronLeft, ChevronRight } from "lucide";
import { AppRouter } from "@app/app.router";
import { ORDERS_PATH } from "../orders.routes";
import "@shared/presentation/components/app-icon";

interface OrderData {
  id: string;
  customerName: string;
  date: string;
  total: string;
  payment: string;
  deliveryStatus: "Delivered" | "Cancelled" | "In Transit";
}

const FAKE_ORDERS: OrderData[] = [
  {
    id: "ORD-44821",
    customerName: "Sophie Laurent",
    date: "8 May 2026",
    total: "€247.00",
    payment: "Visa ••4821",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-42190",
    customerName: "Sophie Laurent",
    date: "19 Apr 2026",
    total: "€89.99",
    payment: "Visa ••4821",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-39844",
    customerName: "Sophie Laurent",
    date: "2 Mar 2026",
    total: "€164.50",
    payment: "MC ••0921",
    deliveryStatus: "Delivered",
  },
  {
    id: "ORD-35120",
    customerName: "Sophie Laurent",
    date: "14 Jan 2026",
    total: "€42.00",
    payment: "Visa ••4821",
    deliveryStatus: "Cancelled",
  },
];

@customElement("order-list-table")
export class OrderListTable extends LitElement {
  static styles = [tailwindStyles];

  @property()
  public orders = [];

  protected render() {
    return html`
      <div
        class="bg-surface-panel/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/5">
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Order
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Delivery
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider text-right"
                ></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${this.orders.map((order) => this.renderRow(order))}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-surface-card/30"
        >
          <div class="text-sm text-text-dim">
            Showing <span class="text-text-primary font-medium">1–4</span> of
            <span class="text-text-primary font-medium">4</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg border border-white/5 text-text-dim hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled
            >
              <app-icon .icon=${ChevronLeft} .size=${18}></app-icon>
            </button>
            ${this.pages.map(
              (page) =>
                html`<button
                  class="w-9 h-9 flex items-center justify-center rounded-lg bg-brand text-white text-sm font-bold shadow-brand transition-all"
                ></button>`,
            )}
            <button
              class="p-2 rounded-lg border border-white/5 text-text-dim hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled
            >
              <app-icon .icon=${ChevronRight} .size=${18}></app-icon>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private renderRow(order: OrderData) {
    return html`
      <tr class="hover:bg-white/[0.02] transition-colors group">
        <td class="px-6 py-4 text-sm text-text-primary font-medium font-mono">
          ${order.id}
        </td>
        <td class="px-6 py-4 text-sm text-text-secondary font-medium">
          ${order.customer_id}
        </td>
        <td class="px-6 py-4 text-sm text-text-secondary">
          ${order.created_at}
        </td>
        <td class="px-6 py-4 text-sm text-text-primary font-bold font-mono">
          ${order.total_amount}
        </td>
        <td class="px-6 py-4 text-sm text-text-secondary">
          ${order.payment_method}
        </td>
        <td class="px-6 py-4">
          ${this.renderDeliveryBadge(order.delivery_status)}
        </td>
        <td class="px-6 py-4 text-right">
          <button
            @click=${() => AppRouter.navigate(`${ORDERS_PATH}/${order.id}`)}
            class="text-brand-light hover:text-brand font-semibold text-sm transition-colors"
          >
            Open →
          </button>
        </td>
      </tr>
    `;
  }

  private renderDeliveryBadge(status: string) {
    const configs = {
      Delivered: "bg-success-bg text-success border-success/20",
      Cancelled: "bg-error-bg text-error border-error/20",
      "In Transit": "bg-warning-bg text-warning border-warning/20",
    };

    const config =
      configs[status as keyof typeof configs] ||
      "bg-surface-card text-text-dim border-white/5";

    return html`
      <span
        class="inline-flex items-center px-2.5 py-1 rounded-full border text-[0.7rem] font-bold uppercase tracking-wider ${config}"
      >
        ${status}
      </span>
    `;
  }
}
