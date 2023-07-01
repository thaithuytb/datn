import { Button, Form, Input, Radio } from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import AuthApi from "../../api/auth";
import Avatar from "../../components/Avatar";
import FileApi from "../../api/file";

export default function PersonalInformation() {
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState(null);
  const authContext = useContext(AuthContext);
  const user = authContext?.authInformation.user;
  const setAuthInformation = authContext?.setAuthInformation;
  const messageContext = useContext(MessageContext);
  const dateOfBrith = new Date(user.createdAt);
  const initialValues = {
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    address: user.address,
    id: user.id,
    gender: user.gender,
    dateCreateAccount: user.createdAt,
    dateOfBrith: `${dateOfBrith.getDate()}-${
      dateOfBrith.getMonth() + 1
    }-${dateOfBrith.getFullYear()}`,
  };

  useEffect(() => {
    (async () => {
      try {
        const fileApi = new FileApi();
        const res = await fileApi.uploadAvatar(file);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [file]);

  const updateInformation = async (values: any) => {
    const { id, fullName, email, phoneNumber, address, gender, createdAt } =
      values;
    const data = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      address: address,
      email: email,
      // id: id,
      // gender: gender,
      // dateCreateAccount: createdAt,
      // dateOfBrith: `${dateOfBrith.getDate()}-${dateOfBrith.getMonth() + 1}-${dateOfBrith.getFullYear()}`,
    };
    const authApi = AuthApi.registerAuthApi();
    try {
      const res = await authApi.updateInformation(data);
      setAuthInformation({
        ...authContext?.authInformation,
        user: { ...res.data },
      });
      messageContext?.success("Cập nhật thông tin cá nhân thành công !!!");
    } catch (error: any) {
      messageContext?.error(error?.message);
    }
  };

  //xử lý ảnh
  const uploader = (event: any) => {
    const reader = new FileReader();
    if (event.target.files[0]) {
      setFile(event.target.files[0]);

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        setResult(event.target.result);
      };
    }
  };

  return (
    <Form
      className="form_left"
      name="basic"
      labelCol={{ span: 5 }}
      style={{ maxWidth: 600 }}
      onFinish={updateInformation}
      initialValues={initialValues}
    >
      <label htmlFor="avatar">
        {/* {result && <Avatar />} */}
        <Avatar width="100px" url={result || ""} />
      </label>
      <input
        type="file"
        id="avatar"
        onChange={(e) => uploader(e)}
        name="postImg"
      />
      <Form.Item label="Tên đầy đủ" name="fullName">
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phoneNumber">
        <Input />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address">
        <Input />
      </Form.Item>

      <Form.Item label="Ngày sinh" name="dateOfBrith">
        <Input />
      </Form.Item>

      <Form.Item label="Ngày tạo tài khoản" name="dateCreateAccount">
        <Input disabled />
      </Form.Item>

      <Form.Item name="gender" label="Giới tính">
        <Radio.Group value={user.gender}>
          <Radio value="MALE">Nam</Radio>
          <Radio value="FEMALE">Nữ</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Thay đổi thông tin
        </Button>
      </Form.Item>
    </Form>
  );
}
