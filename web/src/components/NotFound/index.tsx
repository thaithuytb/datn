import "./index.css";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function NotFound() {
  const authContext = useContext(AuthContext);

  const isAuthenticated = authContext?.authInformation.isAuthenticated;
  const location = useLocation();
  const url = location.pathname;

  if (url === "/") {
    if (isAuthenticated) {
      return <Navigate to="/home" />;
    }
    return <Navigate to="/login" />;
  }
  return (
    <div className="not_found">
      <div>404: NOT FOUND</div>
    </div>
  );
}
