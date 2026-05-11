import type { ICustomersRepository } from "@features/customers/application/ports/customers-repository";
import type { Customer } from "@features/customers/domain/entities/customer";
import type { CustomersRemoteDatasource } from "@features/customers/infrastructure/datasources/customers-remote-datasource";
import { CustomersMapper } from "../mappers/customers-mapper";

export class CustomersRepository implements ICustomersRepository {
    
    constructor(private readonly remoteDatasource: CustomersRemoteDatasource) {}

    async getCustomers() {
        const customerDtos = await this.remoteDatasource.getCustomers();
        return customerDtos.map(CustomersMapper.toDomain);
    }

    async getCustomerById(_id: string) {
        return null;
    }

    async getCustomerByEmail(_email: string) {
        return null;
    }

    async getCustomerByName(_name: string) {
        return null;
    }

    async updateCustomer(_customer: Partial<Customer>) {
    }
}
