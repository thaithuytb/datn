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
            <h3>Đại học bách khoa hà nội</h3>
          </header>
          <form onSubmit={submitFormLogin}>
            <h3>HELLO</h3>
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
        <div className="image_from">
          <img
            src="https://datn-thai-v1-29112001.s3.ap-northeast-1.amazonaws.com/image-20230701041856224-thai-test-2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIASMXT6WUPX2EAV4PP%2F20230630%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20230630T211856Z&X-Amz-Expires=3600&X-Amz-Signature=36b41732530a732c474058c2f34a26e49684a5f8550475c5723505187122562f&X-Amz-SignedHeaders=host&x-id=GetObject"
            alt="background"
          />
        </div>
      </div>
    </div>
    // </div>
  );
}
