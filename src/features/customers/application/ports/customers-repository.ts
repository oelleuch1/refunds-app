/**
 * CUSTOMER SEARCH — step 1
 * - Add searchCustomers({ query, field, page, pageSize })
 * - Return { items: Customer[]; total: number } (inline type, no new files)
 */
import type { Customer } from "@features/customers/domain/entities/customer"

export interface ICustomersRepository {
    getCustomers: () => Promise<Customer[]>
}