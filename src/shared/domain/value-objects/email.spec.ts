import { describe, expect, it } from 'vitest'

import { Email } from '@shared/domain/value-objects/email'

describe('Email', () => {
  it('normalizes valid email addresses', () => {
    const email = Email.create('  Agent@Example.com ')

    expect(email.value).toBe('agent@example.com')
  })

  it('compares email value objects by normalized value', () => {
    const email = Email.create('agent@example.com')

    expect(email.equals(Email.create('  Agent@Example.com '))).toBe(true)
  })

  it('rejects invalid email addresses', () => {
    expect(() => Email.create('not-an-email')).toThrow('Invalid email address.')
  })
})
