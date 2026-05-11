import { describe, expect, it } from 'vitest'
import type { Session } from '@supabase/supabase-js'

import { Email } from '@shared/domain/value-objects/email'
import { UserRole } from '@features/auth/domain/value-objects/user-role'
import { toDomain, toDTO } from '@features/auth/infrastructure/mappers/auth-session-mapper'

describe('authSessionMapper', () => {
  it('maps a provider session to DTO', () => {
    const session = {
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
      expires_in: 3600,
      token_type: 'bearer',
    } as unknown as Session

    expect(toDTO(session)).toEqual({
      userId: 'user-1',
      email: 'agent@example.com',
      fullName: 'Support Agent',
      role: 'support_agent',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })
  })

  it('maps a DTO to a domain session and falls back to support agent for unknown roles', () => {
    const dto = {
      userId: 'user-1',
      email: 'agent@example.com',
      fullName: 'Support Agent',
      role: 'legacy_role',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }

    const session = toDomain(dto)

    expect(session.user.id).toBe('user-1')
    expect(session.user.email).toEqual(Email.create('agent@example.com'))
    expect(session.user.email.value).toBe('agent@example.com')
    expect(session.user.fullName).toBe('Support Agent')
    expect(session.user.role).toBe(UserRole.SupportAgent)
    expect(session.accessToken).toBe('access-token')
    expect(session.refreshToken).toBe('refresh-token')
  })
})
