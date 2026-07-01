import { useAuth } from '../context/AuthContext';

export default function RoleGate({ minRole, children, fallback = null }) {
  const hierarchy = { admin: 3, manager: 2, user: 1 };
  const { user } = useAuth();
  if (!user) return fallback;
  if ((hierarchy[user.role] || 0) < (hierarchy[minRole] || 0)) return fallback;
  return children;
}
