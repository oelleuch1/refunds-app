import type { AuthSession } from '@features/auth/domain/entities/auth-session'
import type { IAuthRepository } from '@features/auth/application/ports/auth-repository'

export class RestoreSessionUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): Promise<AuthSession | null> {
    return this.repository.getCurrentSession()
  }
}
