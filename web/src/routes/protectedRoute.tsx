import { Navigate } from "react-router-dom";

interface PropsProtectedRoute {
  componentRedirect: React.ComponentType;
}

const ProtectedRoute: React.FC<PropsProtectedRoute> = ({
  componentRedirect,
}) => {
  const isAuthenticated = true;
  const ComponentProtected: React.ComponentType = componentRedirect;
  return isAuthenticated ? <ComponentProtected /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
