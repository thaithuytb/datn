import { Navigate } from "react-router-dom";

interface PropsAdminRoute {
  componentRedirect: React.ComponentType;
}

const AdminRoute: React.FC<PropsAdminRoute> = ({
  componentRedirect,
}) => {
  const isAuthenticated = {
    role: "ADMIN",
  };
  const ComponentProtected: React.ComponentType = componentRedirect;
  return isAuthenticated && isAuthenticated.role === "ADMIN" ? (
    <ComponentProtected />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoute;
