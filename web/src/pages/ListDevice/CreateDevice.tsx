import { Button, Form, Input, Select } from "antd";
import { useLocation } from "react-router-dom";

const itemsOptionDevice = [
  {
    value: "FAN",
    label: "Quạt",
  },
  {
    value: "LAMP",
    label: "Đèn",
  },
  {
    value: "CURTAIN",
    label: "Rèm",
  },
  {
    value: "PUMP",
    label: "Máy bơm",
  },
  {
    value: "LIGHTSENSOR",
    label: "Cảm biến ánh sáng",
  },
  {
    value: "HUMISENSOR",
    label: "Cảm biến độ ẩm đất",
  },
  {
    value: "TEMPAIRSENSOR",
    label: "Cảm biến nhiệt độ, độ ẩm",
  },
];

const CreateDevice = () => {
  const location = useLocation();
  const { garden, itemsOption } = location.state;
  const initialValues = {
    gardenId: garden,
  };

  const addNewDevice = (value: any) => {
    console.log(value);
  };
  return (
    <Form
      className="form_left"
      name="basic"
      labelCol={{ span: 7 }}
      style={{ maxWidth: 700 }}
      onFinish={addNewDevice}
      initialValues={initialValues}
    >
      <Form.Item label="IP thiet bi" name="ip">
        <Input />
      </Form.Item>

      <Form.Item label="Trang thai" name="status">
        <Select
          style={{ width: 200 }}
          placeholder={"Trang thai thiet bi"}
          options={[
            {
              value: "true",
              label: "Hoat dong",
            },
            {
              value: "false",
              label: "khong hoat dong",
            },
          ]}
        />
      </Form.Item>

      <Form.Item label="Trong khu vuon" name="gardenId">
        <Select
          style={{ width: 200 }}
          options={itemsOption}
          placeholder={"Chọn khu vườn"}
        />
      </Form.Item>

      <Form.Item label="Loai thiet bi" name="type">
        <Select
          style={{ width: 200 }}
          options={itemsOptionDevice}
          placeholder={"Chọn thiet bi"}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Them thiet bi moi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateDevice;
