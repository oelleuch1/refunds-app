import type { PathRouteConfig } from '@lit-labs/router'
import { html } from 'lit'

import '@features/customers/presentation/pages/customers-page'

export const CUSTOMERS_PATH = '/customers'

export const customersRoutes: readonly PathRouteConfig[] = [
  {
    path: CUSTOMERS_PATH,
    render: () => html`<app-customers-page></app-customers-page>`,
  },
  {
    path: `${CUSTOMERS_PATH}/:id`,
    render: () => html`<app-customers-page></app-customers-page>`,
  },
]
