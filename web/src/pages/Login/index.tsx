import { useState } from "react";
import "./index.css";
import AuthApi from "../../api/auth";
import { LOCAL_STORAGE_TOKEN } from "../../common/local-storage-token";
import { IInformationUserLogin } from "../../types/login.type";
import { useNavigate } from "react-router-dom";

export default function Login(  ) {
  const [informationUserLogin, setInformationUserLogin] = useState<IInformationUserLogin>({
    email: 'admin@admin.com',
    password: 'admin'
  });

  const navigate = useNavigate();

  const { email, password } = informationUserLogin

  const onChangeSetInformationUserLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInformationUserLogin({...informationUserLogin, [e.target.name]: e.target.value});
  }
  const submitFormLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      
    try {
      const res = await AuthApi.registerAuthApi().login({email, password});  
      if (res.data.success) {
        const { user, token } = res.data.data
        localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
        console.log(user)
        console.log(token)
        return navigate('/')
      }
    } catch (error: any) {
      console.log(error.response.data.statusCode);
      console.log(error.response.data.message);
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
