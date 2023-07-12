import React from 'react'
import { Button, Input, Modal } from 'antd'
import { IGarden } from './index'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
interface IShowModal {
    isModalOpen: boolean
    setIsModalOpen: (isModalOpen: boolean) => void
    garden?: IGarden
}


const Update: React.FC<IShowModal> = ({ isModalOpen, setIsModalOpen, garden }) => {
    console.log(garden)
    const countDevices = garden?.devices.length;
    const countDeviceAction = garden?.devices.filter(
      (device: any) => device.status
    ).length;
    const handleOk = () => {
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }
    return (
        <Modal
            title="Thông tin chi tiết"
            open={isModalOpen}
            onCancel={handleCancel}
            width={700}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Cap nhat
                </Button>,
            ]}
        >
            <div className='ModalUpdateGarden'>
                <div className='ModalUpdateGarden_left'>
                    <div>
                        <span>Ten khu vuon:</span>
                        <span><Input defaultValue={garden?.name} /></span>
                    </div>
                    <div>
                        <span>Dia chi:</span>
                        <span><Input defaultValue={garden?.address} /></span>
                    </div>
                    <div>
                        <span>Toa do:</span>
                        <span><Input defaultValue={garden?.address} /></span>
                    </div>
                </div>

                <div className='ModalUpdateGarden_right'>
                    <div>
                        So nguoi tham gia: 
                        <Link to={`/management-worker/${garden?.id  }`}>{garden?.users.length}</Link>
                    </div>
                    <div>
                        So luong thiet bi: 
                        <Link to={`/management-devices/${garden?.id}`}>{`${countDeviceAction} hoat dong / ${countDevices} thiet bi`}</Link>
                    </div>
                    <div>
                        Che do hien tai: 
                        <Link to={`/status-gardens/${garden?.id}`}>{garden?.isAuto ? "Tu dong " : "Tu dieu chinh "}</Link>
                    </div>

                    <div>
                        <span>Ngay bat dau:</span>
                        <span>{dayjs(garden?.createdAt).format("YYYY-MM-DD")}</span>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Update