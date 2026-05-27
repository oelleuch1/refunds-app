import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import { Search } from "lucide";

import "@features/orders/presentation/components/order-list-table";
import "@shared/presentation/components/app-icon";
import { supabase } from "@shared/infrastructure/supabase/supabase";

@customElement("app-orders-page")
export class OrdersPage extends LitElement {
  static styles = [tailwindStyles];

  @state()
  private orders: any[] = [];

  @state()
  private totalOrders: number = 0;

  @state()
  private currentPage: number = 1;

  @state()
  private pageSize: number = 10;

  @state()
  isLoading: boolean = false;

  async getOrders() {
    this.isLoading = true;
    const {
      data: orders,
      error,
      count,
    } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .range(
        (this.currentPage - 1) * this.pageSize,
        (this.currentPage - 1) * this.pageSize + this.pageSize - 1,
      );

    this.isLoading = false;

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
    this.orders = orders;
    this.totalOrders = count ?? 0;
  }

  protected firstUpdated(): void {
    this.getOrders();
  }

  private updatePage(newPage: number) {
    this.currentPage = newPage;
    this.getOrders();
  }

  protected render() {
    return html`
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
        <order-list-table
          .orders=${this.orders}
          .totalOrders=${this.totalOrders}
          .hasNextPage=${this.currentPage * this.pageSize < this.totalOrders}
          .hasPreviousPage=${this.currentPage > 1}
          .isLoading=${this.isLoading}
          @page-change=${(e: CustomEvent) => this.updatePage(e.detail.page)}
        ></order-list-table>
      </div>
    `;
  }
}
