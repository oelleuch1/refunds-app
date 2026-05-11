import { describe, expect, it } from 'vitest'

import { Password } from '@features/auth/domain/value-objects/password'

describe('Password', () => {
  it('accepts passwords with at least 8 characters', () => {
    const password = Password.create('password123')

    expect(password.value).toBe('password123')
  })

  it('rejects passwords shorter than 8 characters', () => {
    expect(() => Password.create('short')).toThrow(
      'Password must be at least 8 characters.',
    )
  })

  it('rejects empty passwords', () => {
    expect(() => Password.create('   ')).toThrow(
      'Password is required.',
    )
  })
})
