import React, { useContext, useEffect, useState } from "react";
import { Button, Form, FormInstance, Modal, Space, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import DeviceApi from "../../api/device";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { MessageContext } from "../../contexts/MessageContext";
import { Device } from "../../types/device.type";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

interface ISetup {
  isModalOpenSetup: boolean;
  setIsModalOpenSetup: (isModalOpenSetup: boolean) => void;
  setup: Device | undefined;
}

const Setup: React.FC<ISetup> = ({
  isModalOpenSetup,
  setIsModalOpenSetup,
  setup,
}) => {
  const messageContext = useContext(MessageContext);
  const success = messageContext?.success;
  // const warning = messageContext?.warning

  const [data, setData] = useState<any>();
  const formRef = React.useRef<FormInstance>(null);

  let initialValues = {
    device: data,
  };

  const deviceApi = DeviceApi.registerDeviceApi();

  const handleCancel = () => {
    setIsModalOpenSetup(false);
  };

  const onFinish = async (values: any) => {
    if (values.device) {
      const startAt = dayjs(values.device[0].startAt).format("HH:mm:ss");
      const endAt = dayjs(values.device[0].endAt).format("HH:mm:ss");
      const dto = {
        id: setup?.id,
        type: setup?.type,
        startAt: startAt,
        endAt: endAt,
      };
      try {
        const res = await deviceApi.updateDevice(dto);
        if (res.success) {
          setIsModalOpenSetup(false);
          success("Cập nhật thành công!!!");
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    (async () => {
      if (setup) {
        const res = await deviceApi.getDeviceById({ id: setup.id });
        if (res) {
          const startAt = res.data.startAt;
          const endAt = res.data.endAt;

          setData([
            {
              startAt: dayjs(`01/01/2023 ${startAt}`, { format: "HH:mm:ss" }),
              endAt: dayjs(`01/01/2023 ${endAt}`, { format: "HH:mm:ss" }),
            },
          ]);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data) {
    formRef.current?.setFieldsValue(initialValues);
  }

  return (
    <Modal
      title="Thiết lập trạng thái"
      width={650}
      open={isModalOpenSetup}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
    >
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        ref={formRef}
      >
        {!data ? (
          <></>
        ) : (
          <Form.List name="device">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: "flex" }} align="baseline">
                    <Form.Item
                      // {...restField}
                      name={[name, "startAt"]}
                      rules={[{ required: true, message: "Chọn thời gian" }]}
                      label="Thời gian bắt đầu"
                    >
                      <TimePicker format={"HH:mm"} />
                    </Form.Item>
                    <Form.Item
                      // {...restField}
                      name={[name, "endAt"]}
                      rules={[
                        { required: true, message: "Chọn khoảng thời gian" },
                      ]}
                      label="Thời gain kết thúc"
                    >
                      <TimePicker format={"HH:mm"} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Setup;
