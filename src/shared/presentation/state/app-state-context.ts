import { createContext } from '@lit/context'

import type { AuthSession } from '@features/auth/domain/entities/auth-session'

export type AppState = {
  session: AuthSession | null
  isRestoringSession: boolean
}

export const initialAppState: AppState = {
  session: null,
  isRestoringSession: true,
}

const appStateContextKey = Symbol('returnops.app-state')

export const appStateContext = createContext<AppState>(appStateContextKey)
