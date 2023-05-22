import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    await context?.logout()
    return navigate('/login')
  }
  return <button style={{border: "1px solid #333"}} onClick={logout}>Logout</button>;
}
