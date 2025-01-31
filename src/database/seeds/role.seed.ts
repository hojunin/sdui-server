import { RoleType } from '../../users/entities/role.entity';

export const initialRoles = [
  {
    name: RoleType.INTERNAL_STAFF,
    permissions: ['view_internal_dashboard', 'manage_basic_data'],
  },
  {
    name: RoleType.PARTNER_STAFF,
    permissions: ['view_partner_dashboard', 'manage_partner_data'],
  },
  {
    name: RoleType.PRODUCT_ADMIN,
    domain: 'product',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_inventory',
      'view_product_analytics',
    ],
  },
  {
    name: RoleType.AUTHENTICATION_ADMIN,
    domain: 'authentication',
    permissions: [
      'manage_user_auth',
      'manage_oauth_settings',
      'view_auth_logs',
    ],
  },
  {
    name: RoleType.SETTLEMENT_ADMIN,
    domain: 'settlement',
    permissions: [
      'manage_settlements',
      'view_transactions',
      'manage_payment_settings',
    ],
  },
  {
    name: RoleType.SUPER_ADMIN,
    permissions: ['manage_all', 'manage_roles', 'manage_permissions'],
  },
  {
    name: RoleType.AD_ADMIN,
    permissions: ['view_ad', 'create_ad', 'edit_ad', 'delete_ad'],
  },
];
