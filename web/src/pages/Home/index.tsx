import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Home() {
  const context = useContext(AuthContext);
  return context?.authInformation?.isAuthenticated ? (
    <div>home</div>
  ) : (
    <Navigate to="/login" />
  );
}
