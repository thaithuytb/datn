import { Button, Form, Input, Radio } from "antd";
import { useContext, useState } from "react";
import { MessageContext } from "../../contexts/MessageContext";
import { useLocation } from "react-router-dom";
import Avatar from "../../components/Avatar";

const UpdateAccount = () => {
  const location = useLocation();
  const messageContext = useContext(MessageContext);
  const { account } = location.state;
  const [file, setFile] = useState()
  const [result, setResult] = useState(null)

  const initialValues = {
    id: account.id,
    fullName: account.fullname,
    email: account.email,
    address: account.address,
    phoneNumber: account.phoneNumber,
    gender: account.gender,
    dateCreateAccount: account.dateCreateAccount,
    dateOfBrith: account.dateOfBrith,
    avata: account.avata,
  };

  //hàm update acount
  const updateInformationById = async (values: any) => {
    const dto = {
      ...values,
      avata: file
    }
    console.log(dto)
    try {

    } catch (error: any) {
      messageContext?.error(error?.message);
    }
  };

  //xử lý ảnh
  const uploader = (event: any) => {
    const reader = new FileReader();
    if (event.target.files[0]) {
      setFile(event.target.files[0])

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        setResult(event.target.result);
      };
    }
  }
  return (
    <Form
      className="form_left"
      name="basic"
      labelCol={{ span: 5 }}
      style={{ maxWidth: 600 }}
      onFinish={updateInformationById}
      initialValues={initialValues}
    >
      <label htmlFor="avatar">
        {/* {result && <Avatar />} */}
        <Avatar width="100px" url={result || ''} />
      </label>
      <input
        type="file"
        id='avatar'
        onChange={(e) => uploader(e)}
        name='postImg'
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

      <Form.Item name='gender' label="Giới tính">
        <Radio.Group value={account.gender}>
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

export default UpdateAccount
