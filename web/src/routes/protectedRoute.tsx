import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface PropsProtectedRoute {
  componentRedirect: React.ComponentType;
}

const ProtectedRoute: React.FC<PropsProtectedRoute> = ({
  componentRedirect,
}) => {
  const authContext = useContext(AuthContext);

  const isAuthenticated = authContext?.authInformation.isAuthenticated;

  const ComponentProtected: React.ComponentType = componentRedirect;
  return isAuthenticated ? <ComponentProtected /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
