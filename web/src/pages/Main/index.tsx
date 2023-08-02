import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.authInformation.isAuthenticated;
  if (isAuthenticated) {
    navigate("/home");
  }
  return <div>Main</div>;
};

export default Main;
