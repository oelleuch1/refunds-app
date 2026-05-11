export class Email {
  private constructor(public readonly value: string) { }

  static create(value: string): Email {
    const normalizedValue = value.trim().toLowerCase()

    if (!Email.isValid(normalizedValue)) {
      throw new Error('Invalid email address.')
    }

    return new Email(normalizedValue)
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
