import React from "react";
import { Button, Input, Modal } from "antd";
import { IGarden } from "./index";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
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
  console.log(garden);
  const countDevices = garden?.devices.length;
  const countDeviceAction = garden?.devices.filter(
    (device: any) => device.status
  ).length;
  const handleOk = () => {};
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
              <Input defaultValue={garden?.name} />
            </span>
          </div>
          <div>
            <span>Địa chỉ:</span>
            <span>
              <Input defaultValue={garden?.address} />
            </span>
          </div>
          <div>
            <span>Tọa độ khu vườn:</span>
            <span>
              <Input defaultValue={garden?.address} />
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
