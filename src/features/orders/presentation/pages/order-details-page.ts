import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

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
interface PurchasedItem {
  id: string;
  name: string;
  category: string;
  returnPolicy: string;
  sku: string;
  qty: number;
  price: string;
  warranty: string;
  eligibility: "Eligible" | "Digital" | "Ineligible";
  icon: any;
}

const FAKE_ITEMS: PurchasedItem[] = [
  {
    id: "1",
    name: "Studio Pro headphones",
    category: "Electronics",
    returnPolicy: "30-day return",
    sku: "SKU-90281",
    qty: 1,
    price: "€149.00",
    warranty: "12 months",
    eligibility: "Eligible",
    icon: Headphones,
  },
  {
    id: "2",
    name: "Phone case — midnight blue",
    category: "Accessories",
    returnPolicy: "14-day return",
    sku: "SKU-33104",
    qty: 2,
    price: "€24.00",
    warranty: "None",
    eligibility: "Eligible",
    icon: Smartphone,
  },
  {
    id: "3",
    name: "Premium music subscription — 1yr",
    category: "Digital",
    returnPolicy: "0-day return",
    sku: "SKU-DIG-07",
    qty: 1,
    price: "€49.00",
    warranty: "N/A",
    eligibility: "Digital",
    icon: Music,
  },
];

@customElement("app-order-details-page")
export class OrderDetailsPage extends LitElement {
  static styles = [tailwindStyles];

  @state()
  private order: OrderData | null = null;

  protected firstUpdated(): void {
    this.order = ordersStore.selectedOrder;
  }

  protected render() {
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
                Delivered
              </span>
            `,
          )}
          ${this.renderInfoCard(
            "ORDER TOTAL",
            html`<span class="text-lg font-bold text-text-primary"
              >€247.00</span
            >`,
          )}
          ${this.renderInfoCard(
            "PAYMENT",
            html`
              <div
                class="flex items-center gap-2 text-text-secondary font-medium"
              >
                <app-icon .icon=${CreditCard} .size=${16}></app-icon>
                Visa ••4821
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
                10 May 2026
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
                ${FAKE_ITEMS.map((item) => this.renderItemRow(item))}
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
