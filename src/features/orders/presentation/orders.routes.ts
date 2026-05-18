import type { RouteConfig } from '@lit-labs/router';
import { html } from 'lit';

import '@features/orders/presentation/pages/orders-page';
import '@features/orders/presentation/pages/order-details-page';

export const ORDERS_PATH = '/orders';

export const ordersRoutes: RouteConfig[] = [
  {
    path: ORDERS_PATH,
    render: () => html`<app-orders-page></app-orders-page>`
  },
  {
    path: `${ORDERS_PATH}/:id`,
    render: () => html`<app-order-details-page></app-order-details-page>`,
  }
];
