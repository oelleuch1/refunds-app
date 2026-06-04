import { type BaseStore } from "@shared/presentation/store/base.sotre";
import type { OrderData } from "../pages/orders-page";
import type { OrderItem } from "../pages/order-details-page";
import { supabase } from "@shared/infrastructure/supabase/supabase";

// Homework
// When clicking on the Eye btn of a row, I want you to set that order as selectedOrder in the store and navigate
// When you are on order-detail-page, get the value of that selectedOrder and display infos of it

//
// Unit test

export class OrdersStore {
  ordersList = [];
  pagesCount = 0;
  from = 0;
  to = 9;
  selectedOrder: OrderData | null = null;
  orderItems: OrderItem[] = [];

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

  async getOrderById(orderId: string): Promise<void> {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId);

    if (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
    this.selectedOrder = orders[0];
  }

  async getOrderItems(orderId: string): Promise<void> {
    const { data: orderItems, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (error) {
      throw new Error(`Error fetching order items: ${error.message}`);
    }
    this.orderItems = orderItems;
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
