import { type BaseStore } from "@shared/presentation/store/base.sotre";
import type { OrderData } from "../pages/orders-page";
import { supabase } from "@shared/infrastructure/supabase/supabase";

// Homework
// When clicking on the Eye btn of a row, I want you to set that order as selectedOrder in the store and navigate
// When you are on order-detail-page, get the value of that selectedOrder and display infos of it

export class OrdersStore {
  ordersList = [];
  pagesCount = 0;
  from = 0;
  to = 9;
  selectedOrder: OrderData | null = null;

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
  }

  async paginate(page: number): Promise<void> {
    this.from = (page - 1) * 10;
    this.to = this.from + 9;
    await this.getOrders();
  }

  setSelectedOrder(order: OrderData): void {
    this.selectedOrder = order;
  }
}

export const ordersStore = new OrdersStore();
