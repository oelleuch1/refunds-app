import { supabase } from "@shared/infrastructure/supabase/supabase";

type ReturnItem = {
  category: string;
  id: string;
  is_digital: boolean;
  order_id: string;
  product_name: string;
  quantity: number;
  return_window_days: number;
  sku: string;
  unit_price: number;
  warranty: string;
};

export class ReturnsStore {
  public state: ReturnItem[] = [];

  async getItems(orderId) {
    // this.state.isLoading = true;
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
    this.state = items;
    console.log(items, "items");
    // this.state.orders = orders || [];
    // this.state.totalOrders = count || 0;
    // this.state.isLoading = false;
  }
}

export const returnsStore = new ReturnsStore();
