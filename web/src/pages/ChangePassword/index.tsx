import { Button, Form, Input } from "antd";
import { useContext } from "react";
import { MessageContext } from "../../contexts/MessageContext";
import { AuthContext } from "../../contexts/AuthContext";
import AuthApi from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const authContext = useContext(AuthContext);
  const user = authContext?.authInformation.user;
  const messageContext = useContext(MessageContext);
  const navigate = useNavigate();

  const initialValues = {
    email: user.email,
  };

  const onChangPassword = async (values: any) => {
    const { email, password, newPassword, authenticationPassword } = values;
    if (newPassword !== authenticationPassword) {
      messageContext?.error("mật khẩu mới nhập lại sai");
    } else {
      const data = {
        password: password,
        newPassword: newPassword,
      };
      const authApi = AuthApi.registerAuthApi();
      try {
        const res = await authApi.updateUnformation(data);
        console.log(res);
        if (res.success) {
          navigate("/login");
          authContext?.logout();
        }
        messageContext?.success("Thay đổi mật khẩu thành công");
      } catch (error: any) {
        messageContext?.error(error?.message);
      }
    }
  };

  return (
    <Form
      className="form_left"
      name="basic"
      labelCol={{ span: 7 }}
      style={{ maxWidth: 700 }}
      onFinish={onChangPassword}
      initialValues={initialValues}
    >
      <Form.Item label="Email" name="email">
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Nhập lại mật khẩu mới"
        name="authenticationPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Thay đổi mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
}
