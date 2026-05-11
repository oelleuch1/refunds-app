import type { User } from '@features/auth/domain/entities/user'

export class AuthSession {
  constructor(
    public readonly user: User,
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) { }
}
