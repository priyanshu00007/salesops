const ROLES_HIERARCHY = { admin: 3, manager: 2, user: 1 };

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Required role: ${allowedRoles.join(' or ')}` });
    }
    next();
  };
}

function authorizeMinRole(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const userLevel = ROLES_HIERARCHY[req.user.role] ?? 0;
    const requiredLevel = ROLES_HIERARCHY[minRole] ?? 0;
    if (userLevel < requiredLevel) {
      return res.status(403).json({ error: `Access denied. Minimum role required: ${minRole}` });
    }
    next();
  };
}

module.exports = { authorize, authorizeMinRole };
