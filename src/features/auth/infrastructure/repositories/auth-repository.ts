import type { IAuthRepository } from '@features/auth/application/ports/auth-repository'
import type { AuthSession } from '@features/auth/domain/entities/auth-session'
import { AuthRemoteDatasource } from '@features/auth/infrastructure/datasources/auth-remote-datasource'
import { AuthSessionMapper } from '@features/auth/infrastructure/mappers/auth-session-mapper'

export class AuthRepository implements IAuthRepository {
  constructor(private readonly remoteDatasource: AuthRemoteDatasource) { }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const sessionDto = await this.remoteDatasource.signIn(email, password)
    return AuthSessionMapper.toDomain(sessionDto)
  }

  async signUp(email: string, password: string, fullName: string, role: string): Promise<AuthSession | null> {
    const sessionDto = await this.remoteDatasource.signUp(email, password, fullName, role)
    return sessionDto ? AuthSessionMapper.toDomain(sessionDto) : null
  }

  async signOut(): Promise<void> {
    await this.remoteDatasource.signOut()
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const sessionDto = await this.remoteDatasource.getCurrentSession()
    return sessionDto ? AuthSessionMapper.toDomain(sessionDto) : null
  }
}
