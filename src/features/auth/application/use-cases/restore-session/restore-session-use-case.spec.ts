import { describe, expect, it, vi } from 'vitest'
import type { IAuthRepository } from '@features/auth/application/ports/auth-repository'
import { UserRole } from '@features/auth/domain/value-objects/user-role'
import { RestoreSessionUseCase } from '@features/auth/application/use-cases/restore-session/restore-session-use-case'

describe('RestoreSessionUseCase', () => {
  it('returns the current session when one exists', async () => {
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
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getCurrentSession: vi.fn().mockResolvedValue(session),
    }

    const useCase = new RestoreSessionUseCase(repository)

    await expect(useCase.execute()).resolves.toEqual(session)

    expect(repository.getCurrentSession).toHaveBeenCalledOnce()
  })

  it('returns null when no session exists', async () => {
    const repository: IAuthRepository = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getCurrentSession: vi.fn().mockResolvedValue(null),
    }

    const useCase = new RestoreSessionUseCase(repository)

    await expect(useCase.execute()).resolves.toBeNull()

    expect(repository.getCurrentSession).toHaveBeenCalledOnce()
  })
})
