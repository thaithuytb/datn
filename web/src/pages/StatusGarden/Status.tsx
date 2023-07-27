import React, { useState } from 'react';
import { getMeasuredAndStatusDevice } from '../../common/status-device';
import dayjs from 'dayjs';
import { Device } from '../../types/device.type';
import { Button, Modal, TimePicker } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
//import icon
import fan from '../../img/fan.png'
import lamp from '../../img/light-bulb.png'
import pump from '../../img/pump.png'
import light_sensor from '../../img/motion-sensor.png'
import humidity_sensor from '../../img/humidity.png'

dayjs.extend(customParseFormat)
interface PropsStatusDevices {
  devices: Device[]
  changeStatusDevice: (device: Device, time: string) => void
  showModalSetup: (record: Device) => void
}

interface PropsModalConfirm {
  isModalOpen: boolean
  setIsModalOpen: (isModalOpen: boolean) => void
  changeStatusDevice: (device: Device, time: string) => void
  device: Device
}

const ModalConfirm: React.FC<PropsModalConfirm> = ({
  isModalOpen,
  setIsModalOpen,
  changeStatusDevice,
  device
}) => {

  const [time, setTime] = useState<string>("99:99")

  const handleOk = async () => {
    try {
      await (changeStatusDevice(device, time))
    } catch (error) {

    }
  }

const onChange = (time: any, timeString: string) => {
  setTime(timeString);
}

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Ban co muon thay doi trang thai thiet bi"
      // width={650}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Đóng
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Cập nhật
        </Button>,
      ]}
    >
      <TimePicker
        onChange={onChange}
        format={"HH:mm"}
      />
    </Modal>
  )
}


const converIcon = (device: Device,
  showModalSetup: (record: Device) => void,
  setIsModalOpen: (isModalOpen: boolean) => void,
  setData: (data: Device | null) => void
) => {

  const openModal = () => {
    setData(device)
    setIsModalOpen(true)
  }

  switch (device.type) {
    case "FAN":
      return (
        <div className='setup-status'>
          <img src={fan} alt="" />
          <div>
            {device.valueDevice.status ?
              <button className="button_threshold" onClick={openModal} >Bật</button>
              :
              <button className="button_threshold" onClick={openModal} >Tắt </button>
            }
            <span onClick={() => showModalSetup(device)} >Thiết lập</span>
          </div>
        </div>
      )
    case "LAMP":
      return (
        <div className='setup-status'>
          <img src={lamp} alt="" />
          <div>
            {device.valueDevice.status ?
              <button className="button_threshold" onClick={openModal} >Bật</button>
              :
              <button className="button_threshold" onClick={openModal} >Tắt </button>
            }
            <span onClick={() => showModalSetup(device)} >Thiết lập</span>
          </div>
        </div>
      )
    case "CURTAIN":
      return <img src={fan} alt="" />
    case "PUMP":
      return (
        <div className='setup-status'>
          <img src={pump} alt="" />
          <div>
            {device.valueDevice.status ?
              <button className="button_threshold" onClick={openModal} >Bật</button>
              :
              <button className="button_threshold" onClick={openModal} >Tắt </button>
            }
            <span onClick={() => showModalSetup(device)} >Thiết lập</span>
          </div>
        </div>
      )
    case "LIGHT_SENSOR":
      return <img className='setup-status_img' src={light_sensor} alt="" />
    case "HUMIDITY_SENSOR":
      return <img className='setup-status_img' src={humidity_sensor} alt="" />
    default:
      return <img className='setup-status_img' src={humidity_sensor} alt="" />
  }
}

const converName = (device: Device) => {
  switch (device.type) {
    case "FAN":
      return <>{`Quạt ${device.valueDevice.status ? "Dang Bat" : "Dang Tat"}`}<br /><br /></>
    case "LAMP":
      return `Đèn ${device.valueDevice.status ? "Dang Bat" : "Dang Tat"}`
    case "CURTAIN":
      return "Rèm Dang bat"
    case "PUMP":
      return `Bơm ${device.valueDevice.status ? "Dang Bat" : "Dang Tat"}`
    case "LIGHT_SENSOR":
      return ""
    case "HUMIDITY_SENSOR":
      return ""
    default:
      return ""
  }
}

const StatusDevices: React.FC<PropsStatusDevices> = (
  { devices, changeStatusDevice, showModalSetup }
) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Device | null>()

  return (
    <div className='StatusDevices'>
      {
        devices.map((device: any, index:number) => {
          return (
            <div className='CardComponent' key={index}>
              {converIcon(device, showModalSetup, setIsModalOpen, setData)}
              <div style={{marginBottom:'1rem'}}>
                {converName(device)}
                {getMeasuredAndStatusDevice(device.valueDevice, device.type)}
              </div>
              <p className='CardComponent-date'>{dayjs(device.updatedAt).format("HH:mm DD-MM-YYYY")}</p>
            </div>
          )
        })
      }

      {
        (isModalOpen && data) &&
        <ModalConfirm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          changeStatusDevice={changeStatusDevice}
          device={data}
        />
      }
    </div>
  )
}

export default StatusDevices