import type { IAuthRepository } from "@features/auth/application/ports/auth-repository";

export class SignOutUseCase {

    constructor(private readonly repository: IAuthRepository) {}

    execute(): Promise<void> {
        return this.repository.signOut();
    }
}