import { describe, expect, it, vi } from 'vitest'

import { Email } from '@shared/domain/value-objects/email'
import { UserRole } from '@features/auth/domain/value-objects/user-role'
import { AuthRepository } from '@features/auth/infrastructure/repositories/auth-repository'
import type { AuthRemoteDatasource } from '@features/auth/infrastructure/datasources/auth-remote-datasource'

describe('AuthRepository', () => {
  it('maps the sign-in DTO returned by the datasource to a domain session', async () => {
    const sessionDto = {
      userId: 'user-1',
      email: 'agent@example.com',
      fullName: 'Support Agent',
      role: UserRole.SupportAgent,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }

    const datasource = {
      signIn: vi.fn().mockResolvedValue(sessionDto),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getCurrentSession: vi.fn(),
    } as unknown as AuthRemoteDatasource

    const repository = new AuthRepository(datasource)

    await expect(
      repository.signIn('agent@example.com', 'password123'),
    ).resolves.toMatchObject({
      user: {
        id: 'user-1',
        fullName: 'Support Agent',
        role: UserRole.SupportAgent,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    const session = await repository.signIn('agent@example.com', 'password123')

    expect(session.user.email).toEqual(Email.create('agent@example.com'))

    expect(datasource.signIn).toHaveBeenCalledWith(
      'agent@example.com',
      'password123',
    )
  })

  it('returns null when the datasource has no current session', async () => {
    const datasource = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getCurrentSession: vi.fn().mockResolvedValue(null),
    } as unknown as AuthRemoteDatasource

    const repository = new AuthRepository(datasource)

    await expect(repository.getCurrentSession()).resolves.toBeNull()

    expect(datasource.getCurrentSession).toHaveBeenCalledOnce()
  })

  it('delegates sign-out to the datasource', async () => {
    const datasource = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn().mockResolvedValue(undefined),
      getCurrentSession: vi.fn(),
    } as unknown as AuthRemoteDatasource

    const repository = new AuthRepository(datasource)

    await expect(repository.signOut()).resolves.toBeUndefined()

    expect(datasource.signOut).toHaveBeenCalledOnce()
  })

  it('maps the sign-up DTO returned by the datasource to a domain session', async () => {
    const sessionDto = {
      userId: 'user-1',
      email: 'agent@example.com',
      fullName: 'Support Agent',
      role: UserRole.SupportAgent,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }

    const datasource = {
      signIn: vi.fn(),
      signUp: vi.fn().mockResolvedValue(sessionDto),
      signOut: vi.fn(),
      getCurrentSession: vi.fn(),
    } as unknown as AuthRemoteDatasource

    const repository = new AuthRepository(datasource)

    const session = await repository.signUp('agent@example.com', 'password123', 'Support Agent', UserRole.SupportAgent)

    expect(session).toMatchObject({
      user: {
        id: 'user-1',
        fullName: 'Support Agent',
        role: UserRole.SupportAgent,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    expect(session?.user.email).toEqual(Email.create('agent@example.com'))
  })
})
