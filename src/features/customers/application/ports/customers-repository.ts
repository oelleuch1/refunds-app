import type { Customer } from "@features/customers/domain/entities/customer"

export interface ICustomersRepository {
    getCustomers: () => Promise<Customer[]>
}