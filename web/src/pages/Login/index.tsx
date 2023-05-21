import { useState } from "react";
import "./index.css";

export default function Login() {
  const [data, setData] = useState<any>();
  const setPrams = (e: any) => {
    let name = e.target.name;
    let value = e.target.value;
    setData({
      ...data,
      [name]: value,
    });
  };
  const submit = (e: any) => {
    e.preventDefault();
  };
  return (
    <div className="wp_login">
      <h1 className="login_title">Đăng nhập</h1>
      <div className="login">
        <form onSubmit={submit} className="login_form">
          <input
            type="text"
            placeholder="usename"
            name="phone"
            onChange={setPrams}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={setPrams}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
