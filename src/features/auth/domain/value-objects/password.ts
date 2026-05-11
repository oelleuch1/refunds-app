export class Password {
  private constructor(public readonly value: string) {}

  static create(value: string): Password {
    if (value.trim().length === 0) {
      throw new Error('Password is required.')
    }

    if (value.length < 8) {
      throw new Error('Password must be at least 8 characters.')
    }
    
    return new Password(value)
  }
}
