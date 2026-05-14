import type { IAuthRepository } from "@features/auth/application/ports/auth-repository"
import type { AuthSession } from "@features/auth/domain/entities/auth-session"
import type { IBaseUseCase } from "@shared/application/ports/base-use-case"
import { Password } from "@features/auth/domain/value-objects/password"
import { Email } from "@shared/domain/value-objects/email"

export interface SignInUseCaseRequest {
    email: string
    password: string
}

export class SignInUseCase implements IBaseUseCase<SignInUseCaseRequest, AuthSession> {
    constructor(private readonly repository: IAuthRepository) { }

    async execute(request: SignInUseCaseRequest): Promise<AuthSession> {
        const email = Email.create(request.email)
        const password = Password.create(request.password)

        return this.repository.signIn(email.value, password.value)
    }
}


// new SignInUseCase(new InMemoryAuthRepository())
// new SignInUseCase(new RemoteAuthRepository())

/**
class RemoteAuthRepository implements IAuthRepository {
    async signIn(email: string, password: string): Promise<AuthSession> {
        // call remote API to sign in
        return fetch('/api/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then(res => res.json())
    }
    async signUp(email: string, password: string, fullName: string, role: string): Promise<AuthSession | null> {
        // call remote API to sign up
        return fetch('/api/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, fullName, role })
        }).then(res => res.json())
    }
    async signOut(): Promise<void> {
        // call remote API to sign out
        await fetch('/api/sign-out', {
            method: 'POST',
        })
    }

    async getCurrentSession(): Promise<AuthSession | null> {
        // call remote API to get current session
        return fetch('/api/current-session', {
            method: 'GET',
        }).then(res => res.json())
    }
}


class InMemoryAuthRepository implements IAuthRepository {
    private sessions: AuthSession[] = [];

    async signIn(email: string, password: string): Promise<AuthSession> {
        const session = new AuthSession({ id: '1', fullName: 'John Doe', email },
            'access-token',
            'refresh-token')
        this.sessions.push(session)
        return session
    }
    async signUp(email: string, password: string, fullName: string, role: string): Promise<AuthSession | null> {
        const session = new AuthSession({ id: '1', fullName, email },
            'access-token',
            'refresh-token')
        this.sessions.push(session)
        return session
    }
    async signOut(): Promise<void> {
        this.sessions = []
    }
    async getCurrentSession(): Promise<AuthSession | null> {
        return this.sessions.length > 0 ? this.sessions[0] : null
    }
}

 * 
 */