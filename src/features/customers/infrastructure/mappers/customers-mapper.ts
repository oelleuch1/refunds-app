import { Email } from "@shared/domain/value-objects/email"
import type { Customer } from "@features/customers/domain/entities/customer"
import type { CustomerRisk } from "@features/customers/domain/value-objects/risk"
import type { CustomerStatus } from "@features/customers/domain/value-objects/status"
import type { CustomerDTO } from "@features/customers/infrastructure/dtos/customer-dto"

export class CustomersMapper {

    static toDomain(dto: CustomerDTO): Customer {
        return {
            id: dto.id,
            fullName: dto.full_name,
            email: Email.create(dto.email),
            phone: dto.phone,
            address: dto.address,
            createdAt: new Date(dto.created_at),
            status: dto.status as CustomerStatus,
            risk: dto.risk as CustomerRisk,
        }
    }

    static toDTO(entity: Customer): CustomerDTO {
        return {
            id: entity.id,
            full_name: entity.fullName,
            email: entity.email.value,
            phone: entity.phone,
            address: entity.address,
            created_at: entity.createdAt.toISOString(),
            status: entity.status,
            risk: entity.risk,
        }
    }
}