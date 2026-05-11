import { RestoreSessionUseCase } from '@features/auth/application/use-cases/restore-session/restore-session-use-case'
import { SignInUseCase } from '@features/auth/application/use-cases/sign-in/sign-in-use-case'
import { SignUpUseCase } from '@features/auth/application/use-cases/sign-up/sign-up-use-case'
import { SignOutUseCase } from '@features/auth/application/use-cases/sign-out/sign-out-use-case'
import { AuthRepository } from '@features/auth/infrastructure/repositories/auth-repository'
import { AuthRemoteDatasource } from '@features/auth/infrastructure/datasources/auth-remote-datasource'
import { GetCustomersUseCase } from '@features/customers/application/use-cases/get-customers/get-customers-use-case'
import { CustomersRemoteDatasource } from '@features/customers/infrastructure/datasources/customers-remote-datasource'
import { CustomersRepository } from '@features/customers/infrastructure/repositories/customers-repository'

const authRemoteDatasource = new AuthRemoteDatasource()
const authRepository = new AuthRepository(authRemoteDatasource)

const customersRemoteDatasource = new CustomersRemoteDatasource()
const customersRepository = new CustomersRepository(customersRemoteDatasource)

export const USE_CASES = {
  auth: {
    signIn: new SignInUseCase(authRepository),
    signUp: new SignUpUseCase(authRepository),
    signOut: new SignOutUseCase(authRepository),
    restoreSession: new RestoreSessionUseCase(authRepository),
  },
  customers: {
      getCustomers: new GetCustomersUseCase(customersRepository),
  }
}
