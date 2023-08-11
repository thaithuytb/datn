import React, { useContext, useState } from "react";
import { Button, Input, Modal } from "antd";
import { IGarden } from "./index";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import GardenApi from "../../api/garden";
import { MessageContext } from "../../contexts/MessageContext";

interface IShowModal {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  garden?: IGarden;
}

const Update: React.FC<IShowModal> = ({
  isModalOpen,
  setIsModalOpen,
  garden,
}) => {

  const gardenApi = GardenApi.registerAuthApi()
  const messageContext = useContext(MessageContext)
  const success = messageContext?.success
  const countDevices = garden?.devices.length;
  const countDeviceAction = garden?.devices.filter(
    (device: any) => device.status
  ).length;

  const [data, setData] = useState({
    name:garden?.name,
    address: garden?.address,
    coordinates: ''
  })

  const changParams = (e:any) => {
    let name = e.target.name
    let value = e.target.value
    setData({
      ...data,
      [name] : value
    })
  }

  const handleOk = async() => { 
    try {
      const res = await gardenApi.changeGarden(data)
      if(res.success) {
        success("cap nhap thanh cong!!!!")
      }
    } catch (error) {
      
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
          Cập nhật
        </Button>,
      ]}
    >
      <div className="ModalUpdateGarden">
        <div className="ModalUpdateGarden_left">
          <div>
            <span>Tên khu vườn:</span>
            <span>
              <Input defaultValue={garden?.name} name="name" onChange={changParams}/>
            </span>
          </div>
          <div>
            <span>Địa chỉ:</span>
            <span>
              <Input defaultValue={garden?.address} name="address" onChange={changParams}/>
            </span>
          </div>
          <div>
            <span>Tọa độ khu vườn:</span>
            <span>
              <Input defaultValue={garden?.address} name="coordinates" onChange={changParams}/>
            </span>
          </div>
        </div>

        <div className="ModalUpdateGarden_right">
          <div>
            Số người tham gia:
            <Link to={`/management-worker/${garden?.id}`}>
              {" "}
              {garden?.users.length}
            </Link>
          </div>
          <div>
            Số lượng thiết bị:
            <Link to={`/management-devices/${garden?.id}`}>
              {" "}
              {`${countDeviceAction} hoạt động/${countDevices} thiết bị`}
            </Link>
          </div>
          <div>
            Chế độ chăm sóc hiện tại:
            <Link to={`/status-gardens/${garden?.id}`}>
              {garden?.isAuto ? " Tự động" : " Tự điều chỉnh"}
            </Link>
          </div>

          <div>
            <span>Ngày bắt đầu:</span>
            <span>
              {` `} {dayjs(garden?.createdAt).format("YYYY-MM-DD")}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Update;
