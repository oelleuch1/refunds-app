import { html, LitElement } from "lit";
import { customElement, state, property } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";

import "@shared/presentation/components/app-form";
import "@shared/presentation/components/app-stepper";
import { supabase } from "@shared/infrastructure/supabase/supabase";

@customElement("returns-new-page")
export class ReturnsNewPage extends LitElement {
  static styles = [tailwindStyles];

  @property({ type: String })
  orderId: string;

  protected firstUpdated(): void {
    console.log("From Props", this.orderId);
  }

  @state()
  steps = [
    { title: "Select item", info: "Choose order item" },
    { title: "Reason", info: "Why returning" },
    { title: "Explanation", info: "Customer details" },
    { title: "Evidence", info: "Photos & files" },
    { title: "Refund calc", info: "Review amount" },
    { title: "Submit", info: "Confirm & send" },
  ];

  // async getItems() {
  //   this.state.isLoading = true;
  //   const { data: orders, count } = await supabase
  //     .from("orders")
  //     .select("*", { count: "exact" })
  //     .range(
  //       (this.state.currentPage - 1) * this.state.pageSize,
  //       (this.state.currentPage - 1) * this.state.pageSize +
  //         this.state.pageSize -
  //         1,
  //     );
  //   console.log("Fetched orders:", orders, "Total count:", count);
  //   this.state.orders = orders || [];
  //   this.state.totalOrders = count || 0;
  //   this.state.isLoading = false;
  // }

  render() {
    return html` <div>
      <app-stepper .steps=${this.steps} .currentStep=${2}></app-stepper>

      <div></div>
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
