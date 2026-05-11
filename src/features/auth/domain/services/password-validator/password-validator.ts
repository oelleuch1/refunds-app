export class PasswordValidator {
    static validate(value: string): void {
        if (value.trim().length === 0) {
            throw new Error('Password is required.')
        }

        if (value.length < 8) {
            throw new Error('Password must be at least 8 characters.')
        }
    }
}