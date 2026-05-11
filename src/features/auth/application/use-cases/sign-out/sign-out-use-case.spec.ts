import { describe, expect, it, vi } from 'vitest'
import type { IAuthRepository } from '@features/auth/application/ports/auth-repository'
import { SignOutUseCase } from '@features/auth/application/use-cases/sign-out/sign-out-use-case'

describe('SignOutUseCase', () => {
it('signs out the current user', async () => {
    const repository: IAuthRepository = {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
    getCurrentSession: vi.fn(),
    }

    const useCase = new SignOutUseCase(repository)

    await expect(useCase.execute()).resolves.toBeUndefined()

    expect(repository.signOut).toHaveBeenCalledOnce()
})
})
