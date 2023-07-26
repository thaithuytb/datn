import React from 'react';
//
import fan from '../../img/fan.png'
import lamp from '../../img/light-bulb.png'
import pump from '../../img/pump.png'
import light_sensor from '../../img/motion-sensor.png'
import humidity_sensor from '../../img/humidity.png'
import { getMeasuredAndStatusDevice } from '../../common/status-device';
import dayjs from 'dayjs';
import { Button } from 'antd';
import { Device } from '../../types/device.type';
interface PropsStatusDevices {
  devices: Device[]
  changeStatusDevice: (device: Device) => void
  showModalSetup: (record: Device) => void
}

const converIcon = (device: Device,
  changeStatusDevice: (device: Device) => void,
  showModalSetup: (record: Device) => void
) => {
  switch (device.type) {
    case "FAN":
      return (
        <div className='setup-status'>
          <img style={{ width: "35%" }} src={fan} alt="" />
          <div>
            <Button size="small" ghost type="primary"
              onClick={() => showModalSetup(device)}
            >
              Thiết lập
            </Button>

            {device.valueDevice.status ?
              <Button type="primary" ghost size="small"
                onClick={() => changeStatusDevice(device)}
              >
                Bật
              </Button>
              :
              <Button type="primary" ghost size="small"
                onClick={() => changeStatusDevice(device)}
              >
                Tắt
              </Button>
            }
          </div>
        </div>
      )
    case "LAMP":
      return (
        <div className='setup-status'>
          <img style={{ width: "35%" }} src={lamp} alt="" />
          <div>
            <Button size="small" ghost type="primary"
              onClick={() => showModalSetup(device)}
            >
              Thiết lập
            </Button>

            {device.valueDevice.status ?
              <Button type="primary" ghost size="small"
                onClick={() => changeStatusDevice(device)}
              >
                Bật
              </Button>
              :
              <Button type="primary" ghost size="small"
                onClick={() => changeStatusDevice(device)}
              >
                Tắt
              </Button>
            }
          </div>
        </div>
      )
    case "CURTAIN":
      return <img style={{ width: "35%" }} src={fan} alt="" />
    case "PUMP":
      return (
        <div className='setup-status'>
          <img style={{ width: "35%" }} src={pump} alt="" />
          <div>
            <Button size="small" ghost type="primary"
              onClick={() => showModalSetup(device)}
            >
              Thiết lập
            </Button>

            {device.valueDevice.status ?
              <Button type="primary" ghost size="small"
                onClick={() => changeStatusDevice(device)}
              >
                Bật
              </Button>
              :
              <Button type="primary" ghost size="small"
                onClick={() => changeStatusDevice(device)}
              >
                Tắt
              </Button>
            }
          </div>
        </div>
      )
    case "LIGHT_SENSOR":
      return <img style={{ width: "35%" }} src={light_sensor} alt="" />
    case "HUMIDITY_SENSOR":
      return <img style={{ width: "35%" }} src={humidity_sensor} alt="" />
    default:
      return <img style={{ width: "35%" }} src={humidity_sensor} alt="" />
  }
}

const converName = (device: Device) => {
  switch (device.type) {
    case "FAN":
      return `Quạt ${device.valueDevice.status ? "Dang Bat" : "Dang Tat"}`
    case "LAMP":
      return `Đèn ${device.valueDevice.status ? "Dang Bat" : "Dang Tat"}`
    case "CURTAIN":
      return "Rèm Dang bat"
    case "PUMP":
      return `Máy bơm ${device.valueDevice.status ? "Dang Bat" : "Dang Tat"}`
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
  return (
    <div className='StatusDevices'>
      {
        devices.map((device: any) => {
          return (
            <div className='CardComponent'>
              {converIcon(device, changeStatusDevice, showModalSetup)}
              <p>
                {converName(device)}
                {getMeasuredAndStatusDevice(device.valueDevice, device.type)}
              </p>
              <p style={{ fontStyle: 'italic', fontSize: '.7rem' }}>{dayjs(device.updatedAt).format("HH:mm DD-MM-YYYY")}</p>
            </div>
          )
        })
      }
    </div>
  )
}

export default StatusDevices