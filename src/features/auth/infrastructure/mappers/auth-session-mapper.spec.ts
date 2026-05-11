import { describe, expect, it } from 'vitest'

import { Email } from '@shared/domain/value-objects/email'
import { AuthSession } from '@features/auth/domain/entities/auth-session'
import { User } from '@features/auth/domain/entities/user'
import { UserRole } from '@features/auth/domain/value-objects/user-role'
import { AuthSessionMapper } from '@features/auth/infrastructure/mappers/auth-session-mapper'

describe('AuthSessionMapper', () => {
  it('maps a DTO to a domain session and falls back to support agent for unknown roles', () => {
    const dto = {
      userId: 'user-1',
      email: 'agent@example.com',
      fullName: 'Support Agent',
      role: 'legacy_role',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    }

    const session = AuthSessionMapper.toDomain(dto)

    expect(session.user.id).toBe('user-1')
    expect(session.user.email).toEqual(Email.create('agent@example.com'))
    expect(session.user.email.value).toBe('agent@example.com')
    expect(session.user.fullName).toBe('Support Agent')
    expect(session.user.role).toBe(UserRole.SupportAgent)
    expect(session.accessToken).toBe('access-token')
    expect(session.refreshToken).toBe('refresh-token')
  })

  it('maps a domain session to a DTO', () => {
    const session = new AuthSession(
      new User(
        'user-1',
        Email.create('agent@example.com'),
        'Support Agent',
        UserRole.SupportAgent,
      ),
      'access-token',
      'refresh-token',
    )

    expect(AuthSessionMapper.toDTO(session)).toEqual({
      userId: 'user-1',
      email: 'agent@example.com',
      fullName: 'Support Agent',
      role: UserRole.SupportAgent,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })
  })
})
