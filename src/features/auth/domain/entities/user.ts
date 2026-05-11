import { Email } from '@shared/domain/value-objects/email'
import { Permission } from '@features/auth/domain/value-objects/permission'
import { UserRole } from '@features/auth/domain/value-objects/user-role'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SupportAgent]: [
    Permission.CustomersSearch,
    Permission.OrdersView,
    Permission.ReturnsCreate,
  ],
  [UserRole.OperationsReviewer]: [
    Permission.CustomersSearch,
    Permission.OrdersView,
    Permission.InspectionsUpdate,
    Permission.RefundsApproveLowRisk,
  ],
  [UserRole.OperationsManager]: [
    Permission.CustomersSearch,
    Permission.OrdersView,
    Permission.InspectionsUpdate,
    Permission.RefundsApproveLowRisk,
    Permission.RefundsApproveException,
    Permission.SettingsManage,
  ],
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly fullName: string,
    public readonly role: UserRole,
  ) {}

  hasPermission(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this.role].includes(permission)
  }
}
