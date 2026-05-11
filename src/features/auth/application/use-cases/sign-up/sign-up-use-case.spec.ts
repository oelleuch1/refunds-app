import { describe, expect, it, vi } from 'vitest'

import type { IAuthRepository } from '@features/auth/application/ports/auth-repository'
import { UserRole } from '@features/auth/domain/value-objects/user-role'
import { SignUpUseCase } from '@features/auth/application/use-cases/sign-up/sign-up-use-case'

function createRepository(overrides: Partial<IAuthRepository> = {}): IAuthRepository {
  return {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getCurrentSession: vi.fn(),
    ...overrides,
  }
}

describe('SignUpUseCase', () => {
  it('registers a user with full name, normalized email, password, and role', async () => {
    const session = {
      user: {
        id: 'user-1',
        email: { value: 'agent@example.com' },
        fullName: 'Support Agent',
        role: UserRole.SupportAgent,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }

    const repository = createRepository({
      signUp: vi.fn().mockResolvedValue(session),
    })

    const useCase = new SignUpUseCase(repository)

    await expect(
      useCase.execute({
        fullName: 'Support Agent',
        email: '  Agent@Example.com ',
        password: 'password123',
        role: UserRole.SupportAgent,
      }),
    ).resolves.toEqual(session)

    expect(repository.signUp).toHaveBeenCalledWith(
      'agent@example.com',
      'password123',
      'Support Agent',
      UserRole.SupportAgent
    )
  })

  it('rejects invalid email before calling the repository', async () => {
    const repository = createRepository()
    const useCase = new SignUpUseCase(repository)

    await expect(
      useCase.execute({
        fullName: 'Support Agent',
        email: 'not-an-email',
        password: 'password123',
        role: UserRole.SupportAgent,
      }),
    ).rejects.toThrow('Invalid email address.')

    expect(repository.signUp).not.toHaveBeenCalled()
  })

  it('rejects weak password before calling the repository', async () => {
    const repository = createRepository()
    const useCase = new SignUpUseCase(repository)

    await expect(
      useCase.execute({
        fullName: 'Support Agent',
        email: 'agent@example.com',
        password: 'short',
        role: UserRole.SupportAgent,
      }),
    ).rejects.toThrow('Password must be at least 8 characters.')

    expect(repository.signUp).not.toHaveBeenCalled()
  })
})
