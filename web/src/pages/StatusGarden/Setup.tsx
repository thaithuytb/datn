import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, FormInstance, Modal, Space, TimePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DeviceApi from '../../api/device';
import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { DataType } from '.';
import { MessageContext } from '../../contexts/MessageContext';

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

    const messageContext = useContext(MessageContext)
    const success = messageContext?.success
    const error = messageContext?.error

    const [data, setData] = useState();
    const formRef = React.useRef<FormInstance>(null);

    let initialValues = {
        device: data
    }

    const deviceApi = DeviceApi.registerDeviceApi();

    const handleCancel = () => {
        setIsModalOpenSetup(false);
    };

    const onFinish = async (values: any) => {
        let time: string[] = []
        let duration: number[] = []
        const todayStart = dayjs().startOf('day');

        if (values.device) {
            for (const item of values.device) {
                const timeItem = dayjs(item.time).format("HH:mm:ss")
                const newTime = (dayjs(item.duration)).diff(todayStart, 'second');
                time.push(timeItem)
                duration.push(newTime)
            }
        }
        try {
            const dto = {
                id: setup?.device.id,
                type: setup?.device.type,
                time: time,
                duration: duration,
                startAt: '',
                endAt: ''
            }
            const res = await deviceApi.updateDevice(dto)
            if(res.success) {
                success('cap nhap thanh cong!!!')
            }
        } catch (error) { }
    };

    useEffect(() => {
        (async () => {
            if (setup) {
                const res = await deviceApi.getDeviceById({ id: setup.id })
                if (res) {
                    const time = JSON.parse((res.data.time as string).replace(/'/g, '"'));
                    const duration = JSON.parse(res.data.duration);

                    const devive = duration.map((item: any, index: number) => {
                        return ({
                            time: dayjs(`01/01/2023 ${time[index]}`, { format: "HH:mm:ss" }),
                            duration: dayjs().startOf('day').add(duration[index], 'second')
                        })
                    })
                    setData(devive)
                }
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (data) {
        formRef.current?.setFieldsValue(initialValues)
    }

    return (
        <Modal title="Thiet lap trang thai" width={650}
            open={isModalOpenSetup} onCancel={handleCancel}
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
                <Form.List name="device">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex' }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'time']}
                                        rules={[{ required: true, message: 'Chon thoi gian' }]}
                                        label='Thoi gian bat dau'
                                    >
                                        <TimePicker
                                            format={'HH:mm'}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'duration']}
                                        rules={[{ required: true, message: 'Chon khoang thoi gian' }]}
                                        label='Thoi gian hoat dong'
                                    >
                                        <TimePicker
                                            format={'HH:mm'}
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
                        Cap nhap
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Setup