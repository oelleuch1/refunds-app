import { Router, type RouteConfig } from '@lit-labs/router'
import { html, type ReactiveControllerHost } from 'lit'

import { authRoutes } from '@features/auth/presentation/auth.routes'
import { dashboardRoutes } from '@features/dashboard/presentation/dashboard.routes'
import { customersRoutes } from '@features/customers/presentation/customers.routes'
import { ordersRoutes } from '@features/orders/presentation/orders.routes'
import { samplesRoutes } from '@features/samples/presentation/samples.routes'

const routes: RouteConfig[] = [
  {
    path: '/',
    render: () => html``,
  },
  ...authRoutes,
  ...dashboardRoutes,
  ...customersRoutes,
  ...ordersRoutes,
  ...samplesRoutes,
]

export class AppRouter {
  private static router: Router | null = null;

  static initialize(host: ReactiveControllerHost & HTMLElement): Router {
    if (!AppRouter.router) {
      AppRouter.router = new Router(host, [...routes])
    }
    return AppRouter.router
  }

  private static use(): Router {
    if (AppRouter.router === null) {
      throw new Error('Router has not been initialized yet.')
    }
    return AppRouter.router
  }

  static async navigate(path: string, options?: { replace?: boolean }): Promise<void> {
    const router = AppRouter.use()
    const method = options?.replace ? 'replaceState' : 'pushState'

    if (window.location.pathname !== path) {
      window.history[method]({}, '', path)
    }

    await router.goto(path)
  }
}
