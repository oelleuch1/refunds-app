import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import { USE_CASES } from "@app/dependencies";
import { Customer } from "@features/customers/domain/entities/customer";

@customElement('app-customers-page')
export class CustomersPage extends LitElement {
  static styles = [tailwindStyles]

  private getCustomersUseCase = USE_CASES.customers.getCustomers

  @state()
  private customers: Customer[] = [];


  connectedCallback(): void {
    super.connectedCallback()
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
      return html`<div> Customers Page (${this.customers.length})</div>`
  }
}
