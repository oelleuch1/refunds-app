import { supabase } from '@shared/infrastructure/supabase/supabase'
import type { AuthSessionDTO } from '@features/auth/infrastructure/dto/auth-session-dto'
import { toDTO } from '@features/auth/infrastructure/mappers/auth-session-mapper'

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

    return toDTO(data.session)
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

    return data.session ? toDTO(data.session) : null
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

    return data.session ? toDTO(data.session) : null
  }
}
