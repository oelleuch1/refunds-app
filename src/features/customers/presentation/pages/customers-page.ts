import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import { ArrowUpDown } from "lucide";

import "@features/customers/presentation/components/customer-search-bar";
import "@features/customers/presentation/components/customer-list-table";
import "@shared/presentation/components/app-icon";
import { supabase } from "@shared/infrastructure/supabase/supabase";

@customElement("app-customers-page")
export class CustomersPage extends LitElement {
  static styles = [tailwindStyles];

  @state()
  private searchQuery: { query: string; column: string } = {
    query: "",
    column: "all",
  };

  @state()
  private customersList = [];

  @state()
  private pagesCount = 0;

  @state()
  private from: number = 0;

  @state()
  private to: number = 9;

  async getCustomers() {
    const {
      data: customers,
      error,
      count,
    } = await supabase
      .from("customers")
      .select("*", { count: "exact" })
      .range(this.from, this.to);
    /**
 *  .or(
        `email.ilike.%${this.searchQuery.query}%,full_name.ilike.%${this.searchQuery.query}%`,
      )
      .eq(this.searchQuery.column, this.searchQuery.query)
 */

    if (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }

    this.pagesCount = Math.ceil(count / 10);
    console.log(count, "count");

    return customers;
  }

  async paginate(page) {
    // page 1: 0 =< 9
    // page 2: 10 => 19
    // page 3: 20 => 29
    this.from = (page - 1) * 10;
    this.to = this.from + 9;
    this.customersList = await this.getCustomers();
  }

  protected async firstUpdated(_changedProperties: PropertyValues): void {
    this.customersList = await this.getCustomers();
  }

  private onSearch(e: CustomEvent) {
    this.searchQuery = e.detail;
  }

  protected render() {
    return html`
      <div
        class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        <!-- Header -->
        <header>
          <h1 class="text-3xl font-bold text-text-primary tracking-tight mb-2">
            Customer search
          </h1>
          <p class="text-text-dim">
            Find customers by name, email, ID or order number.
          </p>
        </header>

        <!-- Search & Filters -->
        <customer-search-bar></customer-search-bar>

        <!-- Results Info -->
        <div class="flex items-center justify-between mb-1">
          <div class="text-sm text-text-dim">
            x results for
            <span class="text-text-primary font-semibold italic"
              >"laurent"</span
            >
          </div>
          <button
            class="flex items-center gap-2 text-sm text-text-dim hover:text-text-primary transition-colors font-medium"
          >
            <app-icon .icon=${ArrowUpDown} .size=${14}></app-icon>
            Sort by relevance
          </button>
        </div>

        <!-- Data Table -->
        <customer-list-table
          .customersList=${this.customersList}
          .pagesCount=${this.pagesCount}
          @pagination=${(e) => this.paginate(e.detail.page)}
        ></customer-list-table>
      </div>
    `;
  }
}
