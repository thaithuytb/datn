import { Button, Form, Input, InputNumber } from "antd";
import GardenApi from "../../api/garden";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateGarden = () => {
  const gardenApi = GardenApi.registerAuthApi();
  const navigate = useNavigate();

  const [hight, setHight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)

  const addNewGarden = async (value: any) => {
    try {
      const dto = {
        name: value.name,
        address: value.address,
        width: value.width,
        length: value.length,
        hight: value.hight,
        landArea: hight * width
      }
      const res = await gardenApi.createGarden(dto)
      if (res.success) {
        console.log(res)
        navigate('/garden')
      }
    } catch (error) {

    }
  };

  const changeWidth = (value: any) => {
    setWidth(Number(value))
  }
  const changeHigjt = (value: any) => {
    setHight(Number(value))
  }

  return (
    <Form
      name="basic"
      onFinish={addNewGarden}
      labelCol={{ flex: '110px' }}
      labelAlign="left"
      labelWrap
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 700, padding: '1rem' }}
    >
      <Form.Item label="Tên khu vườn" name="name"
        rules={[{ required: true, message: "Vui lòng nhập Tên khu vườn" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address"
        rules={[{ required: true, message: "Vui lòng nhập Địa chỉ" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Chiều dài" name="length"
      // rules={[{ required: true, message: "Vui lòng nhập Chiều dài" }]}
      >
        <InputNumber prefix="" style={{ width: '100%' }} onChange={changeHigjt} />
      </Form.Item>

      <Form.Item label="Chiều rộng" name="width"
      // rules={[{ required: true, message: "Vui lòng nhập Chiều rộng" }]}
      >
        <InputNumber prefix="" style={{ width: '100%' }} onChange={changeWidth} />
      </Form.Item>

      <Form.Item label="Chiều cao" name="hight"
      // rules={[{ required: true, message: "Vui lòng nhập Chiều cao" }]}
      >
        <InputNumber prefix="" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Diện tích" name="landArea" >
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            padding: "4px 11px 4px",
          }}
        >
          {hight * width}
        </div>
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
