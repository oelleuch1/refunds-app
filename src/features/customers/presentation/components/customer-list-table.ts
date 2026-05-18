/**
 * CUSTOMER SEARCH — step 8
 * - Remove Supabase + connectedCallback fetch
 * - @property customers, totalCount, currentPage, pageSize from parent
 * - emit page-change on pagination click; fix "Showing X–Y of Z"
 * - Map Customer fields (fullName, email); fix or drop returns/returnRate columns
 */
import { html, LitElement } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { tailwindStyles } from "@styles/tailwind-styles";
import { ChevronLeft, ChevronRight } from "lucide";
import "@shared/presentation/components/app-icon";
import { supabase } from "@shared/infrastructure/supabase/supabase";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: "Active" | "Flagged" | "Blocked";
  risk: "Low" | "Med" | "High";
  returns: number;
  returnRate: string;
}

// const FAKE_CUSTOMERS: CustomerData[] = [
//   {
//     id: 'CUS-8832',
//     name: 'Sophie Laurent',
//     email: 's.laurent@email.fr',
//     initials: 'SL',
//     status: 'Active',
//     risk: 'Low',
//     returns: 2,
//     returnRate: '11%'
//   },
//   {
//     id: 'CUS-6104',
//     name: 'Pierre Laurent-Dubois',
//     email: 'p.laurentdubois@mail.com',
//     initials: 'PL',
//     status: 'Flagged',
//     risk: 'Med',
//     returns: 7,
//     returnRate: '22%'
//   },
//   {
//     id: 'CUS-3291',
//     name: 'Marc Laurent',
//     email: 'm.laurent@proton.me',
//     initials: 'ML',
//     status: 'Blocked',
//     risk: 'High',
//     returns: 22,
//     returnRate: '39%'
//   }
// ];

// Pati: what is this syntax? @customElement("customer-list-table")
@customElement("customer-list-table")
export class CustomerListTable extends LitElement {
  @state()
  private customersList = [];

  @state()
  private pagesCount = 0;

  @state()
  private from: number = 0;

  @state()
  private to: number = 9;

  @property()
  searchQuery: { query: string; column: string };

  static styles = [tailwindStyles];

  async getCustomers() {
    console.log({ searchQuery: this.searchQuery });

    const {
      data: customers,
      error,
      count,
    } = await supabase
      .from("customers")
      .select("*", { count: "exact" })
      .range(this.from, this.to);

    if (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }

    this.pagesCount = Math.ceil(count / 10);
    console.log(count, "count");

    return customers;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.customersList = await this.getCustomers();
    console.log(this.customersList);
  }

  async paginate(page) {
    // page 1: 0 =< 9
    // page 2: 10 => 19
    // page 3: 20 => 29
    this.from = (page - 1) * 10;
    this.to = this.from + 9;
    this.customersList = await this.getCustomers();
  }

  // click on page 1°0;

  // page 1: 0 =< 9
  // page 2: 10 => 19

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
                  Customer
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                >
                  Risk
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider text-center"
                >
                  Returns
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider text-right"
                >
                  Return Rate
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${this.customersList.map((customer) => this.renderRow(customer))}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-surface-card/30"
        >
          <div class="text-sm text-text-dim">
            Showing <span class="text-text-primary font-medium">1–3</span> of
            <span class="text-text-primary font-medium">3</span>
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
                html` <button
                  @click=${() => this.paginate(index + 1)}
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

  private renderRow(customer) {
    return html`
      <tr class="hover:bg-white/[0.02] transition-colors group">
        <td class="px-6 py-4">
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold shadow-brand/20"
            >
              ${this.renderInitials(customer.full_name)}
            </div>
            <div class="flex flex-col">
              <span
                class="text-text-primary font-semibold group-hover:text-white transition-colors"
                >${customer.full_name}</span
              >
              <span class="text-text-dim text-xs">${customer.email}</span>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-text-secondary font-medium font-mono">
          ${customer.id}
        </td>
        <td class="px-6 py-4">${this.renderStatusBadge(customer.status)}</td>
        <td class="px-6 py-4">${this.renderRiskBadge(customer.risk)}</td>
        <td
          class="px-6 py-4 text-sm text-text-primary text-center font-semibold"
        >
          ${customer.returns}
        </td>
        <td
          class="px-6 py-4 text-sm text-text-primary text-right font-semibold"
        >
          ${customer.returnRate}
        </td>
      </tr>
    `;
  }

  private renderInitials(customerName) {
    let initials = customerName
      .split(" ")
      .map((c) => c[0])
      .join("");
    return initials;
    //  customerName = "Alice bob"
    // customerName.split(' ') => ['Alice', 'Bob']
  }

  private renderStatusBadge(status: string) {
    const configs = {
      active: "bg-success-bg text-success border-success/20",
      blocked: "bg-error-bg text-error border-error/20",
    };
    const dotColors = {
      active: "bg-success",
      blocked: "bg-error",
    };

    const config = configs[status as keyof typeof configs];
    const dotColor = dotColors[status as keyof typeof dotColors];

    return html`
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.7rem] font-bold uppercase tracking-wider ${config}"
      >
        <span class="w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse"></span>
        ${status}
      </span>
    `;
  }

  private renderRiskBadge(risk: string) {
    const configs = {
      low: "bg-success-bg text-success border-success/20",
      medium: "bg-warning-bg text-warning border-warning/20",
      high: "bg-error-bg text-error border-error/20",
    };

    const config = configs[risk as keyof typeof configs];

    return html`
      <span
        class="inline-flex items-center px-3 py-1 rounded-lg border text-xs font-bold ${config}"
      >
        ${risk}
      </span>
    `;
  }
}
