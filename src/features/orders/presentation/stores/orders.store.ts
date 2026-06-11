import { supabase } from "@shared/infrastructure/supabase/supabase";
import type { Order } from "../pages/orders-page";

export class OrdersStore {
  public state = {
    orders: [] as Order[],
    totalOrders: 0,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
  };

  async getOrders() {
    this.state.isLoading = true;
    const { data: orders, count } = await supabase
      .from("orders")
      .select("*", { count: "exact" })
      .range(
        (this.state.currentPage - 1) * this.state.pageSize,
        (this.state.currentPage - 1) * this.state.pageSize +
          this.state.pageSize -
          1,
      );
    console.log("Fetched orders:", orders, "Total count:", count);
    this.state.orders = orders || [];
    this.state.totalOrders = count || 0;
    this.state.isLoading = false;
  }

  async updatePage(newPage: number) {
    this.state.currentPage = newPage;
    await this.getOrders();
  }
}

export const ordersStore = new OrdersStore();
