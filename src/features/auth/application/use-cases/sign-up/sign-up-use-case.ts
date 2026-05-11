import type { AuthSession } from '@features/auth/domain/entities/auth-session'
import type { UserRole } from '@features/auth/domain/value-objects/user-role'
import type { IAuthRepository } from '@features/auth/application/ports/auth-repository'
import { Password } from '@features/auth/domain/value-objects/password'
import { Email } from '@shared/domain/value-objects/email'

export interface SignUpUseCaseRequest {
  fullName: string
  email: string
  password: string
  role: UserRole
}

export class SignUpUseCase {
  constructor(private readonly repository: IAuthRepository) { }

  async execute(request: SignUpUseCaseRequest): Promise<AuthSession | null> {
    const email = Email.create(request.email)
    const password = Password.create(request.password)

    return this.repository.signUp(email.value, password.value, request.fullName, request.role)
  }
}
