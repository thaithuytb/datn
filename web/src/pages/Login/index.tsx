import { useContext, useState } from "react";
import "./index.css";
import AuthApi from "../../api/auth";
import { LOCAL_STORAGE_TOKEN } from "../../common/local-storage-token";
import { IInformationUserLogin } from "../../types/login.type";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

export default function Login() {
  const context = useContext(AuthContext);
  
  const [informationUserLogin, setInformationUserLogin] = useState<IInformationUserLogin>({
    email: 'admin@admin.com',
    password: 'admin'
  });

  const navigate = useNavigate();
  
  if (context?.authInformation.isAuthenticated) {
    return <Navigate to='/' />
  }
  const { email, password } = informationUserLogin

  const onChangeSetInformationUserLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInformationUserLogin({...informationUserLogin, [e.target.name]: e.target.value});
  }
  const submitFormLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      
    try {
      if (context?.login) {
        await context.login({ email, password}) 
        return navigate('/')
      }
    } catch (error: any) {
      // TODO: handleError
      console.log(error?.statusCode)
      console.log(error?.message)
    }
  };
  
  return (
    <div className="wp_login">
      <div className="login">
        <h1 className="login_title">Đăng nhập</h1>
        <form onSubmit={submitFormLogin} className="login_form">
          <input
            type="text"
            placeholder="email"
            name="email"
            value={email}
            onChange={onChangeSetInformationUserLogin}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            value={password}
            onChange={onChangeSetInformationUserLogin}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
