import { describe, it, expect } from "vitest"
import { PasswordValidator } from "@features/auth/domain/services/password-validator/password-validator"

describe('PasswordValidator', () => {
    it('rejects empty passwords', () => {
        expect(() => PasswordValidator.validate('')).toThrow('Password is required.')
        expect(() => PasswordValidator.validate('   ')).toThrow('Password is required.')
    })

    it('rejects passwords shorter than 8 characters', () => {
        expect(() => PasswordValidator.validate('short')).toThrow('Password must be at least 8 characters.')
    })
    
    it('accepts valid passwords', () => {
        expect(() => PasswordValidator.validate('validPassword')).not.toThrow()
    })
})
