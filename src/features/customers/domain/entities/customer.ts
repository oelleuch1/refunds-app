import type { Email } from "@shared/domain/value-objects/email";
import type { CustomerStatus } from "@features/customers/domain/value-objects/status";
import type { CustomerRisk } from "@features/customers/domain/value-objects/risk";

export class Customer {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: Email,
    public readonly phone: string,
    public readonly address: string,
    public readonly createdAt: Date,
    public readonly status: CustomerStatus,
    public readonly risk: CustomerRisk,
  ) {}
}