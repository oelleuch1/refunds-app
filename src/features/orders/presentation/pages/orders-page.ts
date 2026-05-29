import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import { Search } from "lucide";

import { type AppDataTableColumn } "@shared/presentation/components/app-table-list";


import "@shared/presentation/components/app-table-list";
import "@shared/presentation/components/app-icon";
import { supabase } from "@shared/infrastructure/supabase/supabase";

export interface OrderData {
  id: string;
  customer_id: string;
  created_at: string;
  total_amount: string;
  payment_method: string;
  delivery_status: "Delivered" | "Cancelled" | "In Transit";
}

@customElement("app-orders-page")
export class OrdersPage extends LitElement {
  static styles = [tailwindStyles];

  @state()
  private ordersList: OrderData[] = [];

  // ordersList = [{ id: 'oooo', customer_id: '222', total_amount: '342', //// }]

  @state()
  private pagesCount = 0;

  @state()
  private from: number = 0;

  @state()
  private to: number = 9;

  @state()
  private columns: AppDataTableColumn<OrderData>[] = [
    { label: "Order", key: "id" },
    { label: "Customer", key: "customer_id" },
    { label: "Date", key: "created_at" },
    { label: "Total", key: "customer_id" },
    {
      label: "Customer",
      key: "total_amount",
      render: (row) => {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.total_amount);
        return html`${formatted}`;
      },
    },
    { label: "Payment", key: "payment_method" },
    {
      label: "Delivery",
      key: "delivery_status",
      render: (row) => {
        const configs = {
          Delivered: "bg-success-bg text-success border-success/20",
          Cancelled: "bg-error-bg text-error border-error/20",
          "In Transit": "bg-warning-bg text-warning border-warning/20",
        };

        const config =
          configs[row.delivery_status as keyof typeof configs] ||
          "bg-surface-card text-text-dim border-white/5";

        return html`
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-full border text-[0.7rem] font-bold uppercase tracking-wider ${config}"
          >
            ${row.delivery_status}
          </span>
        `;
      },
    },
  ];

  async getOrders(): Promise<void> {
    const {
      data: orders,
      error,
      count,
    } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .range(this.from, this.to);

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
    this.ordersList = orders;
    this.pagesCount = Math.ceil((count ?? 0) / 10);
    console.log(this.ordersList);
  }

  async paginate(page: number): Promise<void> {
    this.from = (page - 1) * 10;
    this.to = this.from + 9;
    await this.getOrders();
  }

  firstUpdated() {
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
        <app-data-table
          .rows=${this.ordersList}
          .columns=${this.columns}
          .totalItems=${this.pagesCount}
          @pagination=${(event: { detail: { page: number } }) =>
            this.paginate(event.detail.page)}
        >
        </app-data-table>
      </div>
    `;
  }
}
// @pagination which way doest it work exactly, event is targetting the detail which is set in the child? documentation?
