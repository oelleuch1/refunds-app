/**
 * CUSTOMER SEARCH — step 3
 * - Implement searchCustomers(): call datasource, map with CustomersMapper.toDomain
 */
import type { ICustomersRepository } from "@features/customers/application/ports/customers-repository";
import type { CustomersRemoteDatasource } from "@features/customers/infrastructure/datasources/customers-remote-datasource";
import { CustomersMapper } from "../mappers/customers-mapper";

export class CustomersRepository implements ICustomersRepository {
    
    constructor(private readonly remoteDatasource: CustomersRemoteDatasource) {}

    async getCustomers() {
        const customerDtos = await this.remoteDatasource.getCustomers();
        return customerDtos.map(CustomersMapper.toDomain);
    }
}
