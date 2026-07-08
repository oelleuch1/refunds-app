import { html, LitElement } from "lit";
import { customElement, state, property } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";

import "@shared/presentation/components/app-form";
import "@shared/presentation/components/app-stepper";
import { supabase } from "@shared/infrastructure/supabase/supabase";
import { returnsStore } from "../stores/returns.store";

@customElement("returns-new-page")
export class ReturnsNewPage extends LitElement {
  static styles = [tailwindStyles];

  @property({ type: String })
  orderId: string;

  async firstUpdated(): void {
    await returnsStore.getItems(this.orderId);
    this.requestUpdate();
    ("feat/");
  }

  @state()
  private steps = [
    { title: "Select item", info: "Choose order item" },
    { title: "Reason", info: "Why returning" },
    { title: "Explanation", info: "Customer details" },
    { title: "Evidence", info: "Photos & files" },
    { title: "Refund calc", info: "Review amount" },
    { title: "Submit", info: "Confirm & send" },
  ];

  render() {
    return html` <div>
      <app-stepper .steps=${this.steps} .currentStep=${2}></app-stepper>

      ${returnsStore.state.map(
        (item) => html`<div>${item.product_name} - ${item.quantity}</div>`,
      )}
    </div>`;
  }
}

// fetch order items by the order id from url
// show the stepper
// create a store for the rerturns new page
// load the order and load the order items
// create the firast step - rendering the items and the calculation if the return is possible

// const { data, error } = await supabase
//   .from('orders')
//   .select('*')
//   .eq('id', 'this.orderId')
//   .single();
