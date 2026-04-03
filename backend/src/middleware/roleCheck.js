/**
 * Middleware to restrict access based on user roles
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role does not have permission to perform this action.`,
      });
    }

    next();
  };
};

// Permission constants for easier use
const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
};

const PERMISSIONS = {
  // Users with viewer role can access these
  VIEW_DASHBOARD: [ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN],
  // Users with analyst role and above can view records
  VIEW_RECORDS: [ROLES.ANALYST, ROLES.ADMIN],
  // Only admin can manage records and users
  MANAGE_RECORDS: [ROLES.ADMIN],
  MANAGE_USERS: [ROLES.ADMIN],
};

module.exports = { restrictTo, ROLES, PERMISSIONS };