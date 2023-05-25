import "./index.css";
import { useParams } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { useContext, useEffect } from "react";
import GardenDevicesTable from "../../components/GardenDevicesTable";
import { GardenContext } from "../../contexts/GardenContext";
import { Link } from "react-router-dom";

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
            <p>
              <span>Diện tích</span>
              <span>{gardenDetail.landArea}m²</span>
            </p>
            <p>
              <span>Chiều cao</span>
              <span>{gardenDetail.hight}m</span>
            </p>
            <p>
              <span>Địa chỉ</span>
              <span>{gardenDetail.address} </span>
            </p>
            <p>
              <span>Số thiết bị</span>
              <span>{gardenDetail.devices.length} </span>
            </p>
            <p>
              <span>Số người tham gia</span>
              <span>{gardenDetail.users.length} </span>
            </p>
          </header>
          <div className="garden_list_device">
            <h3>
              Danh sách thiết bị{" "}
              <Link to={`status`}>{" >>"}Trạng thái thiết bị</Link>
            </h3>
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
