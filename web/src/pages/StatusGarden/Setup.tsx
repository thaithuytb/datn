import React from 'react';
import { Button, Form, Modal, Space, TimePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { DataType } from '.';
dayjs.extend(weekday)
dayjs.extend(localeData)

interface ISetup {
    isModalOpenSetup: boolean
    setIsModalOpenSetup: (isModalOpenSetup: boolean) => void
    setup: DataType | undefined
}

const Setup: React.FC<ISetup> = ({
    isModalOpenSetup,
    setIsModalOpenSetup,
    setup
}) => {
    console.log(setup)
    const handleOk = () => {
        setIsModalOpenSetup(false);
    };

    const handleCancel = () => {
        setIsModalOpenSetup(false);
    };

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };
    return (
        <Modal title="Thiet lap trang thai" open={isModalOpenSetup} onOk={handleOk} onCancel={handleCancel}>
            <Form
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.List name="device">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 5 }} align="baseline">
                                    <Form.Item
                                        // {...restField}
                                        name={[name, 'time']}
                                        rules={[{ required: true, message: 'Chon thoi gian' }]}
                                        label='Thoi gian bat dau'
                                    >
                                        <TimePicker
                                            format={'HH:mm'}
                                            value={dayjs('00:00', 'HH:mm')}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        // {...restField}
                                        name={[name, 'period']}
                                        rules={[{ required: true, message: 'Chon khoang thoi gian' }]}
                                        label='Thoi gian ket thuc'
                                    >
                                        <TimePicker
                                            format={'HH:mm'}
                                            value={dayjs('00:00', 'HH:mm')}
                                        />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Setup