import type { Customer } from "@features/customers/domain/entities/customer"

export interface ICustomersRepository {
    getCustomers: () => Promise<Customer[]>
    getCustomerById: (id: string) => Promise<Customer | null>
    getCustomerByEmail: (email: string) => Promise<Customer | null>
    getCustomerByName: (name: string) => Promise<Customer | null>
    updateCustomer: (customer: Partial<Customer>) => Promise<void>
}