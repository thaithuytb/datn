import "./index.css";
import { useContext, useEffect } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import GardenDevicesTable from "../../components/GardenDevicesTable";
import { ColumnsType } from "antd/es/table";

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

export default function ListDevice() {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const gardenContext = useContext(GardenContext);
  const gardenDetail = gardenContext?.gardenDetail;
  const gardens = gardenContext?.gardens;

  useEffect(() => {
    if (gardenId) {
      gardenContext?.getGardenById(gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    if (gardens?.length) {
      navigate(`/list-device/${gardens[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardens]);

  useEffect(() => {
    gardenContext?.getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectGarden = (e: React.FormEvent) => {
    navigate(`/list-device/${(e.target as any).value}`);
  };

  const redirectToStatusDevices = () => {
    navigate("/status-devices");
  };

  return (
    <div className="list_device">
      <div className="list_device_select">
        <div>Khu vườn</div>
        <select onChange={selectGarden}>
          {gardens ? (
            gardens.map((garden) => (
              <option key={garden.id} value={garden.id}>
                {garden.name}
              </option>
            ))
          ) : (
            <option>__Null__</option>
          )}
        </select>
      </div>
      {gardenId && gardenDetail && (
        <div className="list_device_detail">
          <div className="list_device_detail_title">
            Danh sách thiết bị{" "}
            <span onClick={redirectToStatusDevices}>
              {" >>"}Trạng thái thiết bị
            </span>
          </div>
          <GardenDevicesTable
            columns={columns}
            devices={gardenDetail.devices}
          />
        </div>
      )}
    </div>
  );
}
