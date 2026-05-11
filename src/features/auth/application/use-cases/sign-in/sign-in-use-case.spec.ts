
import { describe, expect, it, vi } from 'vitest'
import type { IAuthRepository } from '@features/auth/application/ports/auth-repository'
import { SignInUseCase } from '@features/auth/application/use-cases/sign-in/sign-in-use-case'
import { UserRole } from '@features/auth/domain/value-objects/user-role'

describe('SignInUseCase', () => {
  it('signs in with normalized email and password', async () => {
    const session = {
      user: {
        id: 'user-1',
        email: 'agent@example.com',
        fullName: 'Support Agent',
        role: UserRole.SupportAgent,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }

    const repository: IAuthRepository = {
      signIn: vi.fn().mockResolvedValue(session),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getCurrentSession: vi.fn(),
    }

    const useCase = new SignInUseCase(repository)

    await expect(
      useCase.execute({
        email: '  Agent@Example.com ',
        password: 'password123',
      }),
    ).resolves.toEqual(session)

    expect(repository.signIn).toHaveBeenCalledWith(
      'agent@example.com',
      'password123',
    )
  })

  it('rejects invalid email before calling the repository', async () => {
    const repository: IAuthRepository = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getCurrentSession: vi.fn(),
    }

    const useCase = new SignInUseCase(repository)

    await expect(
      useCase.execute({
        email: 'not-an-email',
        password: 'password123',
      }),
    ).rejects.toThrow('Invalid email address.')

    expect(repository.signIn).not.toHaveBeenCalled()
  })

  it('rejects empty password before calling the repository', async () => {
    const repository: IAuthRepository = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getCurrentSession: vi.fn(),
    }

    const useCase = new SignInUseCase(repository)

    await expect(
      useCase.execute({
        email: 'agent@example.com',
        password: '   ',
      }),
    ).rejects.toThrow('Password is required.')

    expect(repository.signIn).not.toHaveBeenCalled()
  })
})
