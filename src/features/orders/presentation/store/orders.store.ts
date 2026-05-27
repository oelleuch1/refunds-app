import { createContext } from "@lit/context";
import type { IStore } from "@shared/presentation/state/store";

export type OrdersState = {
  selectedOrder: any | null;
};

export type OrdersActions = {
  updateSelectedOrder(order: any | null): void;
};

export interface OrdersStore extends IStore<OrdersState, OrdersActions> {}

export const ordersStoreContext = createContext<OrdersStore>(
  Symbol("orders-store"),
);
