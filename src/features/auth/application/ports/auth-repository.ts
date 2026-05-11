import type { AuthSession } from '@features/auth/domain/entities/auth-session'
import type { UserRole } from '@features/auth/domain/value-objects/user-role'

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<AuthSession>
  signUp(email: string, password: string, fullName: string, role: UserRole): Promise<AuthSession | null>
  signOut(): Promise<void>
  getCurrentSession(): Promise<AuthSession | null>
}
