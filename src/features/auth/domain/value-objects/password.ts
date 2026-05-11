import { PasswordValidator } from "../services/password-validator"

export class Password {
  private constructor(public readonly value: string) { }

  static create(value: string): Password {
    PasswordValidator.validate(value)
    return new Password(value)
  }
}

// Password.create('') // throws Error "Password is required."
// Password.create('short') // throws Error "Password must be at least 8 characters."
// Password.create('validPassword') // returns a Password instance with value 'validPassword'
