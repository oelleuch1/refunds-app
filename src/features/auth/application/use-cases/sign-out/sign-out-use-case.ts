import type { IAuthRepository } from "@features/auth/application/ports/auth-repository";
import type { IBaseUseCase } from "@shared/application/use-cases/base-use-case";

export class SignOutUseCase implements IBaseUseCase<never, void> {

    constructor(private readonly repository: IAuthRepository) { }

    execute(): Promise<void> {
        return this.repository.signOut();
    }
}