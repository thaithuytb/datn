//Warning đang bị ở file này
import "./index.css";
import Table, { ColumnsType } from "antd/es/table";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import dayjs from "dayjs";
import { Button, Modal } from "antd";
import GardenApi from "../../api/garden";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Update from "./Update";
const { confirm } = Modal;

export interface IGarden {
  address: string
  createdAt: string
  devices: any[]
  hight: number
  id: number
  isAuto: boolean
  isDeleted: boolean
  landArea: number
  length: number
  name: string
  updatedAt: string
  users: any[]
  width: number
}

export default function Garden() {
  const gardenApi = GardenApi.registerAuthApi();
  const gardenContext = useContext(GardenContext);
  const gardens = gardenContext?.gardens;
  const getGardens = gardenContext?.getGardens;
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [garden, setGarden] = useState<IGarden>()
  useEffect(() => {
    if (getGardens) {
      getGardens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //xóa khu vườn
  const showDeleteConfirm = (value: any) => {
    confirm({
      title: "Bạn có muốn tiếp tục xóa",
      icon: <ExclamationCircleFilled />,
      content: 'ấn "Cancel" để hủy',
      okText: "Xóa",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        gardenApi.deleteGarden({ id: value.id });
      },
      onCancel() {
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "Stt",
      align: "center",
      dataIndex: "id",
    },
    {
      title: "Tên khu vườn",
      align: "center",
      dataIndex: "name",
    },
    {
      title: "Địa chỉ",
      align: "center",
      dataIndex: "address",
    },
    {
      title: "Ngày bắt đầu",
      align: "center",
      render: (_, record) => dayjs(record.createdAt).format("YYYY-MM-DD"),
    },
    {
      title: "Chế độ chăm sóc hiện tại",
      align: "center",
      render: (_, record) => (record.isAuto ? "Tự chăm sóc" : "Tự điều chỉnh"),
    },
    {
      title: "Số lượng thiết bị",
      align: "center",
      render: (_, record) => {
        const countDevices = record.devices.length;
        const countDeviceAction = record.devices.filter(
          (device: any) => device.status
        ).length;
        return (
          <>
            {countDeviceAction}/{countDevices}
          </>
        );
      },
    },
    {
      title: "Số người tham gia",
      align: "center",
      render: (_, record) => record.users.length,
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button type="primary" ghost onClick={() => showModal(record)}>
            Cập nhật
          </Button>
          <Button
            onClick={() => showDeleteConfirm(record)}
            style={{ marginLeft: "0.5rem" }}
            danger
          >
            Xóa
          </Button>
        </>
      ),
      align: "center",
    },
  ];

  const showModal = (record: IGarden) => {
    setGarden(record)
    setIsModalOpen(true);
  }

  //add new Garden
  const addNewGarden = () => {
    navigate('/garden/new-garden')
  }

  return (
    <div className="garden">
      <div className="garden_header">
        <h3>Quản lý khu vườn</h3>
        <Button onClick={addNewGarden} type="primary" ghost>
          Thêm khu vườn mới
        </Button>
      </div>
      {gardens && (
        <Table
          //   onChange={changPagination}
          pagination={false}
          bordered={true}
          //   pagination={{
          //     pageSize: 7,
          //     total: totalPage,
          //     current: currentPage
          //   }}
          columns={columns}
          dataSource={gardens}
        />
      )}

      <Update
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        garden={garden}
      />
    </div>
  );
}
