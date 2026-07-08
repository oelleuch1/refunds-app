import { supabase } from "@shared/infrastructure/supabase/supabase";

export interface ReturnItem {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  category: string;
}

export enum ReturnSteps {
  SelectItem = 0,
  Reason = 1,
  Explanation = 2,
  Evidence = 3,
  RefundCalculation = 4,
  Submit = 5,
}

interface ReturnsNewState {
  items: ReturnItem[];
  selections: Record<string, number>; // itemId -> quantity to return
  currentStep: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export class ReturnsNewStore {
  public state: ReturnsNewState = {
    items: [],
    selections: {},
    currentStep: 0,
    isLoading: false,
    isSubmitting: false,
    error: null,
  };

  async getOrderItems(orderId: string): Promise<void> {
    this.state.isLoading = true;
    this.state.error = null;

    try {
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      this.state.items = (items ?? []).map((item) => ({
        id: item.id,
        name: item.product_name,
        sku: item.sku,
        unitPrice: Number(item.unit_price),
        quantity: Number(item.quantity),
        category: item.category,
      }));
    } catch (err) {
      this.state.error =
        err instanceof Error ? err.message : "Failed to load order.";
    } finally {
      this.state.isLoading = false;
    }
  }

  toggleItem(id: string): void {
    const next = { ...this.state.selections };
    if (id in next) {
      delete next[id];
    } else {
      next[id] = 1;
    }
    this.state.selections = next;
  }

  setQuantity(id: string, quantity: number): void {
    if (!(id in this.state.selections)) return;
    const item = this.state.items.find((i) => i.id === id);
    const max = item?.quantity ?? 1;
    const clamped = Math.max(1, Math.min(quantity, max));
    this.state.selections = { ...this.state.selections, [id]: clamped };
  }

  goToStep(step: number): void {
    if (step < 0) return;
    this.state.currentStep = step;
  }
}

export const returnsNewStore = new ReturnsNewStore();
