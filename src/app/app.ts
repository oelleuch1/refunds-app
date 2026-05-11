import { LitElement, html } from 'lit'
import { provide } from '@lit/context'
import { customElement, state } from 'lit/decorators.js'

import { USE_CASES } from '@app/dependencies'
import { AppRouter } from '@app/app.router'
import { AUTH_ROUTE_PATHS, LOGIN_PATH } from '@features/auth/presentation/auth.routes'
import { AuthSession } from '@features/auth/domain/entities/auth-session'
import { appStateContext, initialAppState, type AppState } from '@shared/presentation/state/app-state-context'
import { tailwindStyles } from '@styles/tailwind-styles'

import '@shared/presentation/layouts/authenticated-layout'
import '@shared/presentation/layouts/unauthenticated-layout'

@customElement('app-root')
export class AppRoot extends LitElement {
  static styles = [tailwindStyles]

  private readonly restoreSessionUseCase = USE_CASES.auth.restoreSession
  private readonly router = AppRouter.initialize(this)

  @provide({ context: appStateContext })
  @state()
  private appState: AppState = initialAppState

  connectedCallback(): void {
    super.connectedCallback()
    void this.restoreSession()
  }

  protected render() {
    if (this.appState.isRestoringSession) {
      return html`<div id="app" class="min-h-screen min-w-0 bg-[#0b0f1a]"></div>`
    }

    const currentPath = window.location.pathname
    const isAuthRoute = AUTH_ROUTE_PATHS.has(currentPath)

    return isAuthRoute ?
      html`
        <unauthenticated-layout id="app" class="min-h-screen min-w-0">
          ${this.router.outlet()}
        </unauthenticated-layout>
      ` :
      html`
      <authenticated-layout
        id="app"
        class="min-h-screen min-w-0"
        .currentPath=${currentPath}
      >
        ${this.router.outlet()}
      </authenticated-layout>
    `
  }

  private async restoreSession(): Promise<void> {
    try {
      const session = await this.restoreSessionUseCase.execute()
      if (!(session instanceof AuthSession)) {
        throw new Error('No active session')
      }
      this.appState = { session, isRestoringSession: false }
    } catch (error) {
      this.appState = { session: null, isRestoringSession: false }
      await AppRouter.navigate(LOGIN_PATH, { replace: true })
    }
  }
}
