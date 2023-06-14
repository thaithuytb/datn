import { Button, Form, Input } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import AuthApi from "../../api/auth";

export default function PersonalInformation() {
  const authContext = useContext(AuthContext);
  const user = authContext?.authInformation.user;
  const setAuthInformation = authContext?.setAuthInformation;
  const messageContext = useContext(MessageContext);
  const initialValues = {
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    address: user.address,
  };

  const updateInformation = async (values: any) => {
    const { fullName, phoneNumber, address } = values;
    const data = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      address: address,
    };
    const authApi = AuthApi.registerAuthApi();
    try {
      const res = await authApi.updateUnformation(data);
      setAuthInformation({
        ...authContext?.authInformation,
        user: { ...res.data },
      });
      messageContext?.success("thay thành công");
    } catch (error: any) {
      messageContext?.error(error?.message);
    }
  };

  return (
    <Form
      className="form_left"
      name="basic"
      labelCol={{ span: 4 }}
      style={{ maxWidth: 600 }}
      onFinish={updateInformation}
      initialValues={initialValues}
    >
      <Form.Item label="Email" name="email">
        <Input disabled />
      </Form.Item>

      <Form.Item label="fullName" name="fullName">
        <Input />
      </Form.Item>

      <Form.Item label="phoneNumber" name="phoneNumber">
        <Input />
      </Form.Item>

      <Form.Item label="address" name="address">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Thay đổi thông tin
        </Button>
      </Form.Item>
    </Form>
  );
}
