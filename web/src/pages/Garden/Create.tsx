import { Button, Form, Input } from "antd";
import React from "react";

const CreateGarden = () => {
  const addNewGarden = () => {};
  return (
    <Form
      className="form_left"
      name="basic"
      labelCol={{ span: 7 }}
      style={{ maxWidth: 700 }}
      onFinish={addNewGarden}
    >
      <Form.Item label="Tên khu vườn" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateGarden;
