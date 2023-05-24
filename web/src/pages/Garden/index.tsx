import "./index.css";
import { useParams } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { useContext, useEffect } from "react";
import GardenDevicesTable from "../../components/GardenDevicesTable";
import { GardenContext } from "../../contexts/GardenContext";

export interface ColumnNameDeviceGarden {
  stt?: number;
  name: string;
  quantity: number;
  key: string | number;
}

const columns: ColumnsType<ColumnNameDeviceGarden> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "1",
    align: "center",
  },
  {
    title: "Tên thiết bị",
    dataIndex: "name",
    key: "2",
    align: "center",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "3",
    align: "center",
  },
];

export default function Garden() {
  const gardenContext = useContext(GardenContext);
  const { gardenId } = useParams();

  const gardenDetail = gardenContext?.gardenDetail;

  useEffect(() => {
    if (gardenId) {
      gardenContext?.getGardenById(gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  return (
    <div className="garden">
      {gardenDetail && (
        <>
          <header className="garden_header">
            <h3>Thông tin khu vườn</h3>
            <p>Diện tích: {gardenDetail.landArea}</p>
            <p>Chiều cao: {gardenDetail.hight} </p>
            <p>Địa chỉ: {gardenDetail.address} </p>
            <p>Số người tham gia: {gardenDetail.users.length} </p>
          </header>
          <div className="GardenBody">
            <h3>Danh Sách thiết bị</h3>
            <GardenDevicesTable
              columns={columns}
              devices={gardenDetail.devices}
            />
          </div>
        </>
      )}
    </div>
  );
}
