import React from 'react'
import { Button, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../components/Avatar'
interface IShowModal {
    isModalOpen: boolean
    setIsModalOpen: (isModalOpen: boolean) => void
    account: {
        stt: number
        id: number
        fullname: string
        email: string
        address: string
        phoneNumber: string
        gender: string
        dateCreateAccount: string
        dateJoin: string
        dateOfBrith: string
        avata?: string
    } | undefined
}

const Profile: React.FC<IShowModal> = ({ isModalOpen, setIsModalOpen, account }) => {

    const navigate = useNavigate()
    const handleOk = () => {
        setIsModalOpen(false)
        navigate("/account/update-account", { state: { account } });
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
                    Sửa đổi
                </Button>,
            ]}
        >
            <div>
                <header className='ModalProfile_header'>
                    <Avatar width="100px" />
                    <div style={{ paddingLeft: "1rem" }}>
                        <div>{account?.fullname}</div>
                        <div>{account?.dateOfBrith}</div>
                    </div>
                </header>
                <hr />
                <div className='ModalProfile'>
                    <div className='ModalProfile_left'>
                        <div className='ModalProfile_detail'>
                            <span>Tên đầy đủ: </span>
                            <span>{account?.fullname}</span>
                        </div>
                        <div className='ModalProfile_detail'>
                            <span>Email: </span>
                            <span>{account?.email}</span>
                        </div>
                        <div className='ModalProfile_detail'>
                            <span>Số điện thoại: </span>
                            <span>{account?.phoneNumber}</span>
                        </div>
                        <div className='ModalProfile_detail'>
                            <span>Địa chỉ: </span>
                            <span>{account?.address}</span>
                        </div>
                    </div>

                    <div className='ModalProfile_right'>
                        <div className='ModalProfile_detail'>
                            <span>Ngày sinh: </span>
                            <span>{account?.dateOfBrith}</span>
                        </div>
                        <div className='ModalProfile_detail'>
                            <span>Giới tính: </span>
                            <span>{account?.gender}</span>
                        </div>
                        <div className='ModalProfile_detail'>
                            <span>Ngày tạo tài khoản: </span>
                            <span>2-6-20213</span>
                        </div>
                        <div className='ModalProfile_detail'>
                            <span>Ngày tham gia khu vườn: </span>
                            <span>22-7-2023</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Profile