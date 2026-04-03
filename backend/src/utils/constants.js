// Role definitions and permissions
const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
};

const PERMISSIONS = {
  VIEW_DASHBOARD: [ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN],
  VIEW_RECORDS: [ROLES.ANALYST, ROLES.ADMIN],
  MANAGE_RECORDS: [ROLES.ADMIN],
  MANAGE_USERS: [ROLES.ADMIN],
};

// Transaction types
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

// User statuses
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

module.exports = {
  ROLES,
  PERMISSIONS,
  TRANSACTION_TYPES,
  USER_STATUS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};