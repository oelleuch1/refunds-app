import { AuthSession } from '@features/auth/domain/entities/auth-session'
import { User } from '@features/auth/domain/entities/user'
import { Email } from '@shared/domain/value-objects/email'
import type { AuthSessionDTO } from '@features/auth/infrastructure/dto/auth-session-dto'
import { UserRole } from '@features/auth/domain/value-objects/user-role'

export class AuthSessionMapper {
  static toDomain(dto: AuthSessionDTO): AuthSession {
    return new AuthSession(
      new User(
        dto.userId,
        Email.create(dto.email),
        dto.fullName,
        AuthSessionMapper.toUserRole(dto.role),
      ),
      dto.accessToken,
      dto.refreshToken,
    )
  }

  static toDTO(entity: AuthSession): AuthSessionDTO {
    return {
      userId: entity.user.id,
      email: entity.user.email.value,
      fullName: entity.user.fullName,
      role: entity.user.role,
      accessToken: entity.accessToken,
      refreshToken: entity.refreshToken,
    }
  }

  private static toUserRole(role: string): UserRole {
    return Object.values(UserRole).includes(role as UserRole)
      ? role as UserRole
      : UserRole.SupportAgent
  }
}
