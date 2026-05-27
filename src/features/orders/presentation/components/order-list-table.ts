import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { tailwindStyles } from "@styles/tailwind-styles";
import { ChevronLeft, ChevronRight } from "lucide";
import { AppRouter } from "@app/app.router";
import { ORDERS_PATH } from "../orders.routes";
import "@shared/presentation/components/app-icon";

import type { OrderData } from "../pages/orders-page";

@customElement("order-list-table")
export class OrderListTable extends LitElement {
  static styles = [tailwindStyles];

  // property({ type: String, Number, Array, Object, Boolean })

  // @property({ type: Object })
  // public selectedOrder: OrderData | null = null;

  @property({ type: Array })
  public orders: OrderData[] = [];

  @property({ type: Number })
  public pagesCount = 0;

  private emitPagination(page: number): void {
    this.dispatchEvent(new CustomEvent("pagination", { detail: { page } }));
  }

  protected render(): TemplateResult {
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
            ${Array.from({ length: this.pagesCount }).map(
              (_, index) =>
                html`<button
                  @click=${() => this.emitPagination(index + 1)}
                  class="w-9 h-9 flex items-center justify-center rounded-lg bg-brand text-white text-sm font-bold shadow-brand transition-all"
                >
                  ${index + 1}
                </button>`,
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

  private renderRow(order: OrderData): TemplateResult {
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
          ${html`${this.renderAmount(order.total_amount)}`}
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

  private renderAmount(amount: string): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(Number.parseFloat(amount));
  }

  private renderDeliveryBadge(status: string): TemplateResult {
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
