import "./index.css";
import { useParams } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { useContext, useEffect } from "react";
import GardenDevicesTable from "../../components/GardenDevicesTable";
import { GardenContext } from "../../contexts/GardenContext";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Button } from "antd";

export default function Garden() {
  const gardenContext = useContext(GardenContext);
  const gardens = gardenContext?.gardens;
  const getGardens = gardenContext?.getGardens;

  useEffect(() => {
    if (getGardens) {
      getGardens();
    }
  }, []);

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
          <Button type="primary" ghost>
            Cập nhật
          </Button>
          <Button style={{ marginLeft: "0.5rem" }} danger>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="garden">
      <div className="garden_header">
        <h3>Quản lý khu vườn</h3>
        <Button type="primary" ghost>
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
    </div>
  );
}
