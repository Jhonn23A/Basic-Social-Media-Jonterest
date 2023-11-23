// PrivateRoute.js
import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './UserContext';

function PrivateRoute({ path, element }) {
  const { isAuthenticated } = useContext(UserContext);

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default PrivateRoute;
