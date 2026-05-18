import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import { Search } from 'lucide';

import '@features/orders/presentation/components/order-list-table';
import '@shared/presentation/components/app-icon';


@customElement('app-orders-page')
export class OrdersPage extends LitElement {
  static styles = [tailwindStyles]

  protected render() {
    return html`
      <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <!-- Header -->
        <header>
          <h1 class="text-3xl font-bold text-text-primary tracking-tight mb-2">Orders</h1>
          <p class="text-text-dim">All customer orders across the platform</p>
        </header>

        <!-- Search & Filters (Optional but good for consistency) -->
        <div class="bg-surface-panel/40 border border-white/5 rounded-2xl p-6 mb-1 shadow-sm flex gap-3">
          <div class="relative flex-1 group">
            <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-dim group-focus-within:text-brand-light transition-colors">
              <app-icon .icon=${Search} .size=${18}></app-icon>
            </div>
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..." 
              class="w-full bg-surface-card border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:border-brand-light/30 focus:bg-surface-card/60 transition-all"
            >
          </div>
          <button class="bg-brand hover:bg-brand-dark text-white px-6 py-3.5 rounded-xl flex items-center gap-2 font-semibold shadow-brand transition-all active:scale-95">
            <app-icon .icon=${Search} .size=${18} stroke-width="2.5"></app-icon>
            Filter
          </button>
        </div>

        <!-- Data Table -->
        <order-list-table></order-list-table>
      </div>
    `
  }
}
