import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  signInWithPassword,
  signUp,
  signOut,
  getSession,
} = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
}))

vi.mock('@shared/infrastructure/supabase/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword,
      signUp,
      signOut,
      getSession,
    },
  },
}))

import { UserRole } from '@features/auth/domain/value-objects/user-role'
import { AuthRemoteDatasource } from '@features/auth/infrastructure/datasources/auth-remote-datasource'

describe('AuthRemoteDatasource', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('signs in and returns a DTO', async () => {
    signInWithPassword.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-1',
            email: 'agent@example.com',
            user_metadata: {
              full_name: 'Support Agent',
              role: UserRole.SupportAgent,
            },
            app_metadata: {},
          },
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      },
      error: null,
    })

    const datasource = new AuthRemoteDatasource()

    await expect(
      datasource.signIn('agent@example.com', 'password123'),
    ).resolves.toEqual({
      userId: 'user-1',
      email: 'agent@example.com',
      fullName: 'Support Agent',
      role: UserRole.SupportAgent,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'agent@example.com',
      password: 'password123',
    })
  })

  it('throws when sign-in returns an error', async () => {
    signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid credentials' },
    })

    const datasource = new AuthRemoteDatasource()

    await expect(
      datasource.signIn('agent@example.com', 'password123'),
    ).rejects.toThrow('Invalid credentials')
  })

  it('registers a user and returns null when sign-up requires email confirmation', async () => {
    signUp.mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    })

    const datasource = new AuthRemoteDatasource()

    await expect(
      datasource.signUp('agent@example.com', 'password123', 'Support Agent', UserRole.SupportAgent),
    ).resolves.toBeNull()

    expect(signUp).toHaveBeenCalledWith({
      email: 'agent@example.com',
      password: 'password123',
      options: {
        data: {
          full_name: 'Support Agent',
          role: UserRole.SupportAgent,
        },
      },
    })
  })

  it('returns null when no current session exists', async () => {
    getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const datasource = new AuthRemoteDatasource()

    await expect(datasource.getCurrentSession()).resolves.toBeNull()

    expect(getSession).toHaveBeenCalledOnce()
  })

  it('delegates sign-out to supabase auth', async () => {
    signOut.mockResolvedValue({
      error: null,
    })

    const datasource = new AuthRemoteDatasource()

    await expect(datasource.signOut()).resolves.toBeUndefined()

    expect(signOut).toHaveBeenCalledOnce()
  })
})
