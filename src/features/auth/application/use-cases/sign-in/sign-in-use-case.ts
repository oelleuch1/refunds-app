import type { IAuthRepository } from "@features/auth/application/ports/auth-repository"
import type { AuthSession } from "@features/auth/domain/entities/auth-session"
import { Password } from "@features/auth/domain/value-objects/password"
import { Email } from "@shared/domain/value-objects/email"

export interface SignInUseCaseRequest {
    email: string
    password: string
}

export class SignInUseCase {
    constructor(private readonly repository: IAuthRepository) {}

    async execute(request: SignInUseCaseRequest): Promise<AuthSession> {
        const email = Email.create(request.email)
        const password = Password.create(request.password)

        return this.repository.signIn(email.value, password.value)
    }
}
