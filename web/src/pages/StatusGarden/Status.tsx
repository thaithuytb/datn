import React from 'react';
import CardComponent from '../../components/Card';
interface PropsStatusDevices {
  devices: any
}

const StatusDevices:React.FC<PropsStatusDevices> = ({devices}) => {
  return (
    <div className='StatusDevices'>
        {
          devices.map((device: any)=> {
            return <CardComponent 
            device={device}
            />
          })
        }
    </div>
  )
}

export default StatusDevices