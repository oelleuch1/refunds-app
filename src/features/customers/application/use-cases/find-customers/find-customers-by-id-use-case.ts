import type { Customer } from "@features/customers/domain/entities/customer";
import type { ICustomersRepository } from "@features/customers/application/ports/customers-repository";

export class FindCustomersByIdUseCase {
    constructor(private readonly repository: ICustomersRepository) {}

    async execute(id: string): Promise<Customer | null> {
        return await this.repository.getCustomerById(id);
    }
}
