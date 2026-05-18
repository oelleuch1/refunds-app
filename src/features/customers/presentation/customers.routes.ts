import type { PathRouteConfig } from '@lit-labs/router'
import { html } from 'lit'

import '@features/customers/presentation/pages/customers-page'
import '@features/customers/presentation/pages/customer-details-page'

export const CUSTOMERS_PATH = '/customers'

export const customersRoutes: readonly PathRouteConfig[] = [
  {
    path: CUSTOMERS_PATH,
    render: () => html`<app-customers-page></app-customers-page>`,
  },
  {
    path: `${CUSTOMERS_PATH}/:id`,
    render: (params) => html`<app-customer-details-page .customerId=${params.id}></app-customer-details-page>`,
  },
]
