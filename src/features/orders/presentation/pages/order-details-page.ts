import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AppRouter } from "@app/app.router";
import { Undo2, type IconNode } from "lucide";

import { tailwindStyles } from "@styles/tailwind-styles";
import {
  RotateCcw,
  Package,
  CreditCard,
  Calendar,
  Clock,
  Headphones,
  Smartphone,
  Music,
  CheckCircle2,
  XCircle,
} from "lucide";

import "@shared/presentation/components/app-icon";

import { ordersStore } from "../stores/orders.store";
import type { OrderData } from "./orders-page";

import "@shared/presentation/components/app-table-list";
import type {
  AppDataTableAction,
  AppDataTableColumn,
} from "@shared/presentation/components/app-table-list";

export type OrderItem = {
  product_name: string;
  category: string;
  status: string;
  sku: string;
  unit_price: string;
  return_unit_days: number;
};

@customElement("app-order-details-page")
export class OrderDetailsPage extends LitElement {
  static styles = [tailwindStyles];

  private actions: AppDataTableAction<OrderItem>[] = [
    {
      icon: Undo2,
      method: (orderItem) => {
        console.log("return clicked", orderItem);
      },
    },
  ];

  private columns: AppDataTableColumn<OrderItem>[] = [
    {
      label: "Item",
      key: "product_name",
    },
    {
      label: "Category",
      key: "category",
    },
    {
      label: "SKU",
      key: "sku",
    },
    {
      label: "Price",
      key: "unit_price",
      // render: () => {<return "00.1 $";},
    },
    {
      label: "Return Window",
      key: "return_unit_days",
    },
    ,
  ];

  get order(): OrderData {
    return ordersStore.selectedOrder;
  }

  async firstUpdated() {
    if (!ordersStore.selectedOrder) {
      await ordersStore.getOrderById(AppRouter.router.params.id);
    }
    await ordersStore.getOrderItems(this.order.id);
    this.requestUpdate();
  }

  protected render() {
    if (!this.order) {
      return html`Fetching order data`;
    }

    return html`
      <div
        class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12"
      >
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-sm text-text-dim">
          <a href="/customers" class="hover:text-text-primary transition-colors"
            >Customers</a
          >
          <span>/</span>
          <a href="#" class="hover:text-text-primary transition-colors"
            >Sophie Laurent</a
          >
          <span>/</span>
          <span class="text-text-primary font-medium"
            >${this.order?.id ?? "—"}</span
          >
        </nav>

        <!-- Header -->
        <div class="flex items-center justify-between">
          <header>
            <h1
              class="text-3xl font-bold text-text-primary tracking-tight mb-2"
            >
              Order ${this.order?.id ?? "—"}
            </h1>
            <p class="text-text-dim">
              Sophie Laurent · s.laurent@email.fr · Placed 8 May 2026
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
                ${this.order.delivered_at}
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

        <app-data-table
          .rows=${ordersStore.orderItems}
          .columns=${this.columns}
          .actions=${this.actions}
        >
        </app-data-table>
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

  private renderItemRow(item: PurchasedItem) {
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
