import type { Customer } from "@features/customers/domain/entities/customer";
import type { ICustomersRepository } from "@features/customers/application/ports/customers-repository";

export class GetCustomersUseCase {
    constructor(private readonly repository: ICustomersRepository) {}

    async execute(): Promise<Customer[]> {
        return await this.repository.getCustomers();
    }
}
