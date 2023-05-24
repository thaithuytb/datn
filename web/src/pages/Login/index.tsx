import "./index.css";
import { useContext, useState } from "react";
import { IInformationUserLogin } from "../../types/login.type";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";

export default function Login() {
  const authContext = useContext(AuthContext);
  const messageContext = useContext(MessageContext);

  const [informationUserLogin, setInformationUserLogin] =
    useState<IInformationUserLogin>({
      email: "admin@admin.com",
      password: "admin",
    });

  const navigate = useNavigate();

  if (authContext?.authInformation.isAuthenticated) {
    return <Navigate to="/" />;
  }
  const { email, password } = informationUserLogin;

  const onChangeSetInformationUserLogin = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInformationUserLogin({
      ...informationUserLogin,
      [e.target.name]: e.target.value,
    });
  };
  //validate data
  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: any) => {
    return password.length >= 4;
  };

  const submitFormLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      messageContext?.error("email của bạn đang không đúng định dạng");
    } else if (!validatePassword(password)) {
      messageContext?.error("password tối thiểu 4 ký tự");
    } else {
      try {
        await authContext?.login({ email, password });
        messageContext?.success("Đăng nhập thành công");
        return navigate("/");
      } catch (error: any) {
        messageContext?.error(error?.message);
      }
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
