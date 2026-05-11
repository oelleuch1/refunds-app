import type { Session } from '@supabase/supabase-js'

import { AuthSession } from '@features/auth/domain/entities/auth-session'
import { User } from '@features/auth/domain/entities/user'
import { Email } from '@shared/domain/value-objects/email'
import { UserRole } from '@features/auth/domain/value-objects/user-role'
import type { AuthSessionDTO } from '@features/auth/infrastructure/dto/auth-session-dto'

const DEFAULT_ROLE = UserRole.SupportAgent

function isUserRole(value: unknown): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole)
}

function resolveRole(session: Session): string {
  const metadataRole =
    session.user.user_metadata.role ?? session.user.app_metadata.role

  return typeof metadataRole === 'string' ? metadataRole : DEFAULT_ROLE
}

function resolveFullName(session: Session): string {
  return (
    session.user.user_metadata.full_name ??
    session.user.user_metadata.name ??
    session.user.email ??
    'Unknown user'
  )
}

export function toDTO(session: Session): AuthSessionDTO {
  return {
    userId: session.user.id,
    email: session.user.email ?? '',
    fullName: resolveFullName(session),
    role: resolveRole(session),
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  }
}

export function toDomain(dto: AuthSessionDTO): AuthSession {
  return new AuthSession(
    new User(
      dto.userId,
      Email.create(dto.email),
      dto.fullName,
      isUserRole(dto.role) ? dto.role : DEFAULT_ROLE,
    ),
    dto.accessToken,
    dto.refreshToken,
  )
}
