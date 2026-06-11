import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
// import { ordersStoreContext, type OrdersStore } from "../store/orders.store";

import { tailwindStyles } from "@styles/tailwind-styles";
import {
  RotateCcw,
  Package,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide";

import "@shared/presentation/components/app-icon";

@customElement("app-order-details-page")
export class OrderDetailsPage extends LitElement {
  static styles = [tailwindStyles];
  /**
 *   @consume({ context: ordersStoreContext, subscribe: true })
  @property({ attribute: false })
  ordersStore?: OrdersStore;

 */

  get order() {
    // return this.ordersStore?.state.selectedOrder;
    return null;
  }

  protected render() {
    if (!this.order) {
      return html`
        <div class="flex items-center justify-center h-64">
          <app-icon
            .icon=${Loader2}
            .size=${24}
            class="animate-spin"
          ></app-icon>
        </div>
      `;
    }

    return html`
      <div
        class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12"
      >
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-sm text-text-dim">
          <a href="/orders" class="hover:text-text-primary transition-colors"
            >Orders</a
          >
          <span>/</span>
          <span class="text-text-primary font-medium">${this.order.id}</span>
        </nav>

        <!-- Header -->
        <div class="flex items-center justify-between">
          <header>
            <h1
              class="text-3xl font-bold text-text-primary tracking-tight mb-2"
            >
              Order ${this.order.id}
            </h1>
            <p class="text-text-dim">
              Customer ID: ${this.order.customer_id} · Placed
              ${new Date(this.order.created_at).toLocaleDateString()}
            </p>
          </header>
          <button
            class="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-brand transition-all active:scale-95"
          >
            <app-icon .icon=${RotateCcw} .size=${18}></app-icon>
            New Return
          </button>
        </div>

        <!-- Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          ${this.renderInfoCard(
            "STATUS",
            html`
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-success/20 bg-success-bg text-success text-[0.7rem] font-bold uppercase tracking-wider"
              >
                <app-icon .icon=${CheckCircle2} .size=${12}></app-icon>
                ${this.order.delivery_status}
              </span>
            `,
          )}
          ${this.renderInfoCard(
            "ORDER TOTAL",
            html`<span class="text-lg font-bold text-text-primary"
              >${this.order.total_amount}</span
            >`,
          )}
          ${this.renderInfoCard(
            "PAYMENT",
            html`
              <div
                class="flex items-center gap-2 text-text-secondary font-medium"
              >
                <app-icon .icon=${CreditCard} .size=${16}></app-icon>
                ${this.order.payment_method}
              </div>
            `,
          )}
          ${this.renderInfoCard(
            "DELIVERED",
            html`
              <div
                class="flex items-center gap-2 text-text-secondary font-medium"
              >
                <app-icon .icon=${Calendar} .size=${16}></app-icon>
                ${new Date(this.order.created_at).toLocaleDateString()}
              </div>
            `,
          )}
          ${this.renderInfoCard(
            "RETURN WINDOW",
            html`
              <div class="flex items-center gap-2 text-success font-bold">
                <app-icon .icon=${Clock} .size=${16}></app-icon>
                28 days left
              </div>
            `,
          )}
        </div>

        <!-- Items Table -->
        <div
          class="bg-surface-panel/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm"
        >
          <div
            class="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2"
          >
            <app-icon
              .icon=${Package}
              .size=${18}
              class="text-brand-light"
            ></app-icon>
            <h2
              class="font-bold text-text-primary uppercase tracking-wider text-sm"
            >
              Purchased items
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/5">
                  <th
                    class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                  >
                    SKU
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider text-center"
                  >
                    QTY
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                  >
                    Warranty
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                  >
                    Return Eligible
                  </th>
                  <th
                    class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider text-right"
                  ></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <app-icon
                  .icon=${Loader2}
                  .size=${24}
                  class="animate-spin text-text-dim my-10"
                ></app-icon>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  private renderInfoCard(label: string, content: any) {
    return html`
      <div
        class="bg-surface-panel/40 border border-white/5 rounded-2xl p-5 shadow-sm flex flex-col gap-3"
      >
        <span
          class="text-[0.65rem] font-bold text-text-dim uppercase tracking-widest"
          >${label}</span
        >
        <div>${content}</div>
      </div>
    `;
  }

  private renderItemRow(item) {
    return html`
      <tr class="hover:bg-white/[0.02] transition-colors group">
        <td class="px-6 py-6">
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-surface-card border border-white/5 flex items-center justify-center text-text-dim group-hover:text-brand-light transition-colors"
            >
              <app-icon .icon=${item.icon} .size=${20}></app-icon>
            </div>
            <div class="flex flex-col">
              <span
                class="text-text-primary font-semibold group-hover:text-white transition-colors"
                >${item.name}</span
              >
              <span class="text-text-dim text-xs"
                >${item.category} · ${item.returnPolicy}</span
              >
            </div>
          </div>
        </td>
        <td class="px-6 py-6 text-sm text-text-secondary font-medium font-mono">
          ${item.sku}
        </td>
        <td class="px-6 py-6 text-sm text-text-primary text-center font-bold">
          ${item.qty}
        </td>
        <td class="px-6 py-6 text-sm text-text-primary font-bold font-mono">
          ${item.price}
        </td>
        <td class="px-6 py-6 text-sm text-text-secondary">${item.warranty}</td>
        <td class="px-6 py-6">${this.renderEligibility(item.eligibility)}</td>
        <td class="px-6 py-6 text-right">
          <button
            class="text-brand-light hover:text-brand font-semibold text-sm transition-colors"
          >
            Return →
          </button>
        </td>
      </tr>
    `;
  }

  private renderEligibility(eligibility: string) {
    if (eligibility === "Eligible") {
      return html`
        <span
          class="flex items-center gap-1.5 text-success font-medium text-sm"
        >
          <app-icon .icon=${CheckCircle2} .size=${14}></app-icon>
          Eligible
        </span>
      `;
    }
    if (eligibility === "Digital") {
      return html`
        <span class="flex items-center gap-1.5 text-error font-medium text-sm">
          <app-icon .icon=${XCircle} .size=${14}></app-icon>
          Digital
        </span>
      `;
    }
    return html`
      <span class="flex items-center gap-1.5 text-text-dim font-medium text-sm">
        <app-icon .icon=${XCircle} .size=${14}></app-icon>
        Ineligible
      </span>
    `;
  }
}
