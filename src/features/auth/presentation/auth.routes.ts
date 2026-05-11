import type { PathRouteConfig } from '@lit-labs/router'
import { html } from 'lit'

import '@features/auth/presentation/pages/login-page'
import '@features/auth/presentation/pages/register-page'
import '@features/auth/presentation/pages/forgot-password-page'

export const LOGIN_PATH = '/login'
export const REGISTER_PATH = '/register'
export const FORGOT_PASSWORD_PATH = '/forgot-password'

export const AUTH_ROUTE_PATHS = new Set([
  LOGIN_PATH,
  REGISTER_PATH,
  FORGOT_PASSWORD_PATH,
])

export const authRoutes: readonly PathRouteConfig[] = [
  {
    path: LOGIN_PATH,
    render: () => html`<auth-login-page></auth-login-page>`,
  },
  {
    path: REGISTER_PATH,
    render: () => html`<auth-register-page></auth-register-page>`,
  },
  {
    path: FORGOT_PASSWORD_PATH,
    render: () => html`<auth-forgot-password-page></auth-forgot-password-page>`,
  },
]
