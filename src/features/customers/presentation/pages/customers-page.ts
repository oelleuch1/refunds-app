import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import { ArrowUpDown } from 'lucide';

import { USE_CASES } from "@app/dependencies";
import type { Customer } from "@features/customers/domain/entities/customer";

import '@features/customers/presentation/components/customer-search-bar';
import '@features/customers/presentation/components/customer-list-table';
import '@shared/presentation/components/app-icon';


@customElement('app-customers-page')
export class CustomersPage extends LitElement {
  static styles = [tailwindStyles]

  private getCustomersUseCase = USE_CASES.customers.getCustomers

  @state()
  private customers: Customer[] = [];


  firstUpdated(): void {
    this.loadCustomers()
  }

  private async loadCustomers(): Promise<void> {
    try {
      this.customers = await this.getCustomersUseCase.execute();
    } catch (error) {
      console.error('Failed to load customers:', error)
    }
  }

  protected render() {
    return html`
      <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <!-- Header -->
        <header>
          <h1 class="text-3xl font-bold text-text-primary tracking-tight mb-2">Customer search</h1>
          <p class="text-text-dim">Find customers by name, email, ID or order number.</p>
        </header>

        <!-- Search & Filters -->
        <customer-search-bar></customer-search-bar>

        <!-- Results Info -->
        <div class="flex items-center justify-between mb-1">
          <div class="text-sm text-text-dim">
            x results for <span class="text-text-primary font-semibold italic">"laurent"</span>
          </div>
          <button class="flex items-center gap-2 text-sm text-text-dim hover:text-text-primary transition-colors font-medium">
            <app-icon .icon=${ArrowUpDown} .size=${14}></app-icon>
            Sort by relevance
          </button>
        </div>

        <!-- Data Table -->
        <customer-list-table></customer-list-table>
      </div>
    `
  }
}
