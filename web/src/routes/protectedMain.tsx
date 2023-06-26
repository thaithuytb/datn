import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { LOCAL_STORAGE_TOKEN } from "../common/local-storage-token";

const RefreshUrl = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_TOKEN)) {
    return <Navigate to="/login" />;
  }
  return <></>;
};

const ProtectedMain = () => {
  const auth = useContext(AuthContext);
  const isAuth = auth?.authInformation.isAuthenticated;

  return !isAuth ? <RefreshUrl /> : <Outlet />;
};

export default ProtectedMain;
