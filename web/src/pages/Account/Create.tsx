import React, { useContext } from 'react'
import { Button, Form, Input, Radio } from 'antd';
import { MessageContext } from '../../contexts/MessageContext';
import AuthApi from '../../api/auth';

const CreateAccount = () => {
  const messageContext = useContext(MessageContext);
  const authApi = AuthApi.registerAuthApi();

  const createAccount = async (values: any) => {
    const { email, password, confirmPassword, fullName, phoneNumber, address, gender } = values;
    if (password !== confirmPassword) {
      messageContext?.error("mật khẩu nhập lại sai")
    } else {

      const dto = {
        email,
        password,
        confirmPassword,
        fullName,
        phoneNumber,
        address,
        gender
      }
      try {
        await authApi.createAccount(dto)
        messageContext?.success("Tạo thành công");
      } catch (error: any) {
        messageContext?.error(error?.message);
      }
    }
  };

  return (
    <Form
      name="basic"
      labelCol={{ flex: '110px' }}
      labelAlign="left"
      labelWrap
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 700, padding:'1rem' }}
      onFinish={createAccount}
    >
      <Form.Item
        label="Email" name="email"
        rules={[{ required: true, message: "Vui lòng nhập email" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Nhập lại mật khẩu"
        name="confirmPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label="Tên đầy đủ" name="fullName">
        <Input />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phoneNumber">
        <Input />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address">
        <Input />
      </Form.Item>

      <Form.Item name='gender' label="Giới tính">
        <Radio.Group>
          <Radio value="MALE">Nam</Radio>
          <Radio value="FEMALE">Nữ</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Tạo tài khoản
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CreateAccount