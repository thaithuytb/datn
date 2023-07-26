import React from 'react';
import './index.css'
import { getMeasuredAndStatusDevice } from '../../common/status-device';
import dayjs from 'dayjs';
//
import fan from '../../img/fan.png'
import lamp from '../../img/light-bulb.png'
import pump from '../../img/pump.png'
import light_sensor from '../../img/motion-sensor.png'
import humidity_sensor from '../../img/humidity.png'

interface PropsCardComponent {
    device: any
}

const conver = (type: string) => {
    switch (type) {
        case "FAN":
            return <img style={{width:"35%"}} src={fan} alt="" />
        case "LAMP":
            return <img style={{width:"35%"}} src={lamp} alt="" />
        case "CURTAIN":
            return <img style={{width:"35%"}} src={fan} alt="" />
        case "PUMP":
            return <img style={{width:"35%"}} src={pump} alt="" />
        case "LIGHT_SENSOR":
            // return "Cảm biến ánh sáng"
            return <img style={{width:"35%"}} src={light_sensor} alt="" />
        case "HUMIDITY_SENSOR":
            // return "Cảm biến độ ẩm đất"
            return <img style={{width:"35%"}} src={humidity_sensor} alt="" />
        default:
            // return "Cảm biến nhiệt độ, độ ẩm"
            return <img style={{width:"35%"}} src={humidity_sensor} alt="" />
    }
}

const CardComponent: React.FC<PropsCardComponent> = ({ device }) => {
    console.log(device)
    return (
        <div className='CardComponent'>
            {conver(device.type)}
            <p>{getMeasuredAndStatusDevice(device.valueDevice, device.type)}</p>
            <p style={{fontStyle:'italic', fontSize:'.7rem'}}>{dayjs(device.updatedAt).format("HH:mm DD-MM-YYYY")}</p>
        </div>
    )
}

export default CardComponent