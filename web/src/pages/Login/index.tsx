import "./index.css";
import { useContext, useState } from "react";
import { IInformationUserLogin } from "../../types/login.type";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import background from "../../../public/Background.png";

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
    return <Navigate to="/home" />;
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
        return navigate("/home");
      } catch (error: any) {
        messageContext?.error(error?.message);
      }
    }
  };

  return (
    // <div className="background_login">
    <div className="wp_login">
      <div className="login">
        <div className="login_form">
          <header>
            <img
              style={{ width: "30px", height: "auto", marginRight: "0.5rem" }}
              src="https://upload.wikimedia.org/wikipedia/vi/thumb/e/ef/Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_B%C3%A1ch_Khoa_H%C3%A0_N%E1%BB%99i.svg/1200px-Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_B%C3%A1ch_Khoa_H%C3%A0_N%E1%BB%99i.svg.png"
              alt=""
            />
            <h3>Đại học Bách Khoa Hà Nội</h3>
          </header>
          <form onSubmit={submitFormLogin}>
            <div style={{display: 'flex', marginLeft: '-140px'}}><p style={{color:'red', paddingRight: '10px'}}>*</p> <p>Email</p></div>
            <input
              type="text"
              placeholder="email"
              name="email"
              value={email}
              onChange={onChangeSetInformationUserLogin}
            />
            <div style={{display: 'flex', marginLeft: '-120px'}}><p style={{color:'red', paddingRight: '10px'}}>*</p> <p>Mật khẩu</p></div>
            <input
              type="password"
              placeholder="password"
              name="password"
              value={password}
              onChange={onChangeSetInformationUserLogin}
            />
            <button type="submit">Đăng nhập</button>
          </form>
        </div>
      </div>
    </div>
    // </div>
  );
}
