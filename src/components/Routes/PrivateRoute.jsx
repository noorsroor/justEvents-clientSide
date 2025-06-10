import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isLoggedIn, role, isTokenValid, logout } = useUser();
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const validateAccess = () => {
      if (!isTokenValid()) {
        toast.dismiss();
        toast.error('Session expired. Please log in again.', { toastId: 'session-expired' });
        logout();
        setRedirectPath('/login');
      } else if (
        (Array.isArray(roles) &&
          roles.length > 0 &&
          !roles.map((r) => r.toLowerCase()).includes(role?.toLowerCase())) ||
        (typeof roles === 'string' && role?.toLowerCase() !== roles.toLowerCase())
      ) {
        toast.dismiss();
        toast.error('Access denied: insufficient role.', { toastId: 'access-denied' });
        setRedirectPath('/login');
      }

      setChecked(true);
    };

    validateAccess();
  }, [isLoggedIn, role, roles, isTokenValid, logout]);

  if (!checked) return null;

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
