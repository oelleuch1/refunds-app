import type { PathRouteConfig } from '@lit-labs/router'
import { html } from 'lit'

import '@features/dashboard/presentation/pages/dashboard-page'

export const DASHBOARD_PATH = '/dashboard'

export const dashboardRoutes: readonly PathRouteConfig[] = [
  {
    path: DASHBOARD_PATH,
    render: () => html`<app-dashboard-page></app-dashboard-page>`,
  },
]
