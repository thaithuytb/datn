import { Button, Form, Input } from "antd";
import GardenApi from "../../api/garden";
import { useNavigate } from "react-router-dom";

const CreateGarden = () => {
  const gardenApi = GardenApi.registerAuthApi();
  const navigate = useNavigate()
  const addNewGarden = async (value: any) => {
    try {
      const dto = {
        name: value.name,
        address: value.address
      }
      const res = await gardenApi.createGarden(dto)
      if (res.success) {
        navigate('/garden')
      }
    } catch (error) {

    }
  };
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
