import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import {
  User,
  History,
  Flag,
  Ban,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide';

import { AppRouter } from "@app/app.router";
import { CUSTOMERS_PATH } from "../customers.routes";
import { ORDERS_PATH } from "@features/orders/presentation/orders.routes";
import '@shared/presentation/components/app-icon';

interface OrderSummary {
  id: string;
  date: string;
  itemsCount: number;
  total: string;
  deliveryStatus: 'Delivered' | 'Cancelled';
  returnEligible: 'Yes' | 'Expired' | 'N/A';
}

const RECENT_ORDERS: OrderSummary[] = [
  {
    id: 'ORD-44821',
    date: '8 May 2026',
    itemsCount: 4,
    total: '€247.00',
    deliveryStatus: 'Delivered',
    returnEligible: 'Yes'
  },
  {
    id: 'ORD-42190',
    date: '19 Apr 2026',
    itemsCount: 1,
    total: '€89.99',
    deliveryStatus: 'Delivered',
    returnEligible: 'Yes'
  },
  {
    id: 'ORD-39844',
    date: '2 Mar 2026',
    itemsCount: 1,
    total: '€164.50',
    deliveryStatus: 'Delivered',
    returnEligible: 'Expired'
  },
  {
    id: 'ORD-35120',
    date: '14 Jan 2026',
    itemsCount: 2,
    total: '€42.00',
    deliveryStatus: 'Cancelled',
    returnEligible: 'N/A'
  }
];

@customElement('app-customer-details-page')
export class CustomerDetailsPage extends LitElement {
  static styles = [tailwindStyles]

  @property({ type: String })
  customerId = 'CUS-8832';

  protected render() {
    return html`
      <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-sm text-text-dim">
          <a href="/customers" class="hover:text-text-primary transition-colors">Customer search</a>
          <span>/</span>
          <span class="text-text-primary font-medium">Sophie Laurent</span>
        </nav>

        <!-- Header -->
        <div class="flex items-center justify-between">
          <header>
            <h1 class="text-4xl font-bold text-text-primary tracking-tight mb-2">Sophie Laurent</h1>
            <p class="text-text-dim">s.laurent@email.fr · ${this.customerId}</p>
          </header>
          <div class="flex items-center gap-3">
            <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-text-secondary hover:bg-white/5 transition-all font-semibold">
              <app-icon .icon=${Ban} .size=${18}></app-icon>
              Block
            </button>
            <button class="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-brand transition-all active:scale-95">
              <app-icon .icon=${RotateCcw} .size=${18}></app-icon>
              New return
            </button>
          </div>
        </div>

        <!-- Profile Badges -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white text-lg font-bold shadow-brand/20">
            SL
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-success/20 bg-success-bg text-success text-[0.7rem] font-bold uppercase tracking-wider">
              <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
              Active
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-success/20 bg-success-bg text-success text-[0.7rem] font-bold uppercase tracking-wider">
              Low risk
            </span>
            <span class="text-text-dim text-sm ml-2 font-medium">Member since 12 Jan 2024</span>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Customer Details Card -->
          <div class="bg-surface-panel/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
              <app-icon .icon=${User} .size=${18} class="text-brand-light"></app-icon>
              <h2 class="font-bold text-text-primary uppercase tracking-wider text-sm">Customer details</h2>
            </div>
            <div class="p-6 flex flex-col gap-4">
              ${this.renderDetailRow('Full name', 'Sophie Laurent')}
              ${this.renderDetailRow('Email', 's.laurent@email.fr')}
              ${this.renderDetailRow('Phone', '+33 6 12 34 56 78')}
              ${this.renderDetailRow('Address', '14 Rue de Rivoli, 75004 Paris')}
              ${this.renderDetailRow('Member since', '12 Jan 2024')}
            </div>
          </div>

          <!-- Return History Summary Card -->
          <div class="bg-surface-panel/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div class="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
              <app-icon .icon=${CheckCircle2} .size=${18} class="text-success"></app-icon>
              <h2 class="font-bold text-text-primary uppercase tracking-wider text-sm">Return history summary</h2>
            </div>
            <div class="p-6 flex flex-col gap-4">
              ${this.renderDetailRow('Total orders', '18')}
              ${this.renderDetailRow('Total returns', '2')}
              ${this.renderDetailRow('Return rate', '11%')}
              ${this.renderDetailRow('Total refunded', '€127.50')}
              ${this.renderDetailRow('Last return', '22 Mar 2026')}
            </div>
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="bg-surface-panel/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <h2 class="font-bold text-text-primary uppercase tracking-wider text-sm mb-1">Recent orders</h2>
            <p class="text-text-dim text-xs">4 orders shown</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/5">
                  <th class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider">Order</th>
                  <th class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider">Date</th>
                  <th class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider text-center">Items</th>
                  <th class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider">Total</th>
                  <th class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider">Delivery</th>
                  <th class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider">Return Eligible</th>
                  <th class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${RECENT_ORDERS.map(order => this.renderOrderRow(order))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  }

  private renderDetailRow(label: string, value: string) {
    return html`
      <div class="flex items-center justify-between">
        <span class="text-sm text-text-dim font-medium">${label}</span>
        <span class="text-sm text-text-primary font-bold">${value}</span>
      </div>
    `;
  }

  private renderOrderRow(order: OrderSummary) {
    return html`
      <tr class="hover:bg-white/[0.02] transition-colors group">
        <td class="px-6 py-4 text-sm text-text-primary font-medium font-mono">${order.id}</td>
        <td class="px-6 py-4 text-sm text-text-secondary">${order.date}</td>
        <td class="px-6 py-4 text-sm text-text-primary text-center font-bold">${order.itemsCount}</td>
        <td class="px-6 py-4 text-sm text-text-primary font-bold font-mono">${order.total}</td>
        <td class="px-6 py-4">
          ${this.renderDeliveryBadge(order.deliveryStatus)}
        </td>
        <td class="px-6 py-4">
          ${this.renderReturnEligible(order.returnEligible)}
        </td>
        <td class="px-6 py-4 text-right">
          <button 
            @click=${() => AppRouter.navigate(`${ORDERS_PATH}/${order.id}`)}
            class="text-brand-light hover:text-brand font-semibold text-sm transition-colors"
          >
            View →
          </button>
        </td>
      </tr>
    `;
  }

  private renderDeliveryBadge(status: string) {
    const config = status === 'Delivered'
      ? 'bg-success-bg text-success border-success/20'
      : 'bg-error-bg text-error border-error/20';

    return html`
      <span class="inline-flex items-center px-2.5 py-1 rounded-full border text-[0.7rem] font-bold uppercase tracking-wider ${config}">
        ${status}
      </span>
    `;
  }

  private renderReturnEligible(eligible: string) {
    if (eligible === 'Yes') {
      return html`<span class="text-success text-sm font-medium">Yes</span>`;
    }
    if (eligible === 'Expired') {
      return html`<span class="text-warning text-sm font-medium">Expired</span>`;
    }
    return html`<span class="text-text-dim text-sm font-medium">N/A</span>`;
  }
}
