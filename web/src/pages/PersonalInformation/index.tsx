import "./index.css";
import { Button, DatePicker, Form, Input, Radio } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MessageContext } from "../../contexts/MessageContext";
import AuthApi from "../../api/auth";
import Avatar from "../../components/Avatar";
import FileApi from "../../api/file";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function PersonalInformation() {
  const [path, setPath] = useState<null | string>(null);
  const authContext = useContext(AuthContext);
  const user = authContext?.authInformation.user;
  const setAuthInformation = authContext?.setAuthInformation;
  const messageContext = useContext(MessageContext);
  const [changeDisplay, setChangeDisplay] = useState<boolean>(true);
  const navigate = useNavigate();
  const dateFormat = "YYYY-MM-DD";

  const initialValues = {
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    address: user.address,
    id: user.id,
    gender: user.gender,
    dateCreateAccount: dayjs(user.createdAt).format("YYYY-MM-DD"),
    dateOfBrith: user.dateOfBirth ? dayjs(user.dateOfBirth, dateFormat) : null,
    path: user.path,
  };

  const updateInformation = async (values: any) => {
    const { fullName, email, phoneNumber, address, gender, dateOfBrith } =
      values;
    const data = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      address: address,
      email: email,
      gender: gender,
      dateOfBirth: dayjs(dateOfBrith),
    };
    console.log(data);
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

  const onChangPassword = async (values: any) => {
    const { password, newPassword, authenticationPassword } = values;
    if (newPassword !== authenticationPassword) {
      messageContext?.error("mật khẩu mới nhập lại sai");
    } else {
      const data = {
        password: password,
        newPassword: newPassword,
      };
      const authApi = AuthApi.registerAuthApi();
      try {
        const res = await authApi.updateInformation(data);
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

  //xử lý ảnh
  const uploader = async (event: any) => {
    if (event.target.files[0]) {
      const fileApi = new FileApi();
      const res = await fileApi.uploadAvatar(event.target.files[0]);
      if (typeof res?.data?.path === "string") {
        setPath(res?.data?.path);
      }
      // console.log("aaaaa", res?.data?.path);
      // // console.log(res);
      // // setPath(JSON.stringify(res?.data?.path));
    }
  };

  //
  const change = () => {
    setChangeDisplay(!changeDisplay);
  };

  return (
    <div className="form_left">
      <label htmlFor="avatar">
        <Avatar
          width="100px"
          url={path ? path : initialValues.path ? initialValues.path : ""}
        />
      </label>
      <input
        type="file"
        id="avatar"
        onChange={(e) => uploader(e)}
        name="postImg"
      />
      <br />
      <br />

      {changeDisplay ? (
        <Form
          name="personall_form"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 700 }}
          onFinish={updateInformation}
          initialValues={initialValues}
        >
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
            <DatePicker
              // defaultValue={dayjs(user.dateOfBirth, dateFormat)}
              inputReadOnly={true}
              format={dateFormat}
            />
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

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Thay đổi thông tin
            </Button>
            <span style={{ padding: "0 1rem" }} />
            <Button type="link" htmlType="button" onClick={change}>
              {`Mật khẩu ->`}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="basic"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
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

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="link" htmlType="button" onClick={change}>
              {`<- Thông tin`}
            </Button>
            <span style={{ padding: "0 1rem" }} />
            <Button type="primary" htmlType="submit">
              Thay đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
