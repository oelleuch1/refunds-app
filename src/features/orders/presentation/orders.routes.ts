import type { RouteConfig } from "@lit-labs/router";
import { html } from "lit";

import "@features/orders/presentation/pages/orders-page";
import "@features/orders/presentation/pages/order-details-page";

export const ORDERS_PATH = "/orders";

export const ordersRoutes: RouteConfig[] = [
  {
    path: ORDERS_PATH,
    render: () => html`<app-orders-page></app-orders-page>`,
  },
  // dynamic routes /orders/orderId
  {
    path: `${ORDERS_PATH}/:id`,
    render: (id) =>
      html`<app-order-details-page .id=${id}></app-order-details-page>`,
  },
];
