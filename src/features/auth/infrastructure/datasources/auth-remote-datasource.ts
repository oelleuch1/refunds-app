import type { Session } from '@supabase/supabase-js'

import { supabase } from '@shared/infrastructure/supabase/supabase'
import type { AuthSessionDTO } from '@features/auth/infrastructure/dto/auth-session-dto'

export class AuthRemoteDatasource {
  async signIn(email: string, password: string): Promise<AuthSessionDTO> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.session) {
      throw new Error('Sign-in succeeded without an active session.')
    }

    return this.toAuthSessionDTO(data.session)
  }

  async signUp(email: string, password: string, fullName: string, role: string): Promise<AuthSessionDTO | null> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data.session ? this.toAuthSessionDTO(data.session) : null
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  }

  async getCurrentSession(): Promise<AuthSessionDTO | null> {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    return data.session ? this.toAuthSessionDTO(data.session) : null
  }

  private toAuthSessionDTO(session: Session): AuthSessionDTO {
    return {
      userId: session.user.id,
      email: session.user.email ?? '',
      fullName: session.user.user_metadata.full_name,
      role: session.user.user_metadata.role,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    }
  }
}
