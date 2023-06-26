import "./index.css";
import { useContext, useEffect } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import GardenDevicesTable from "../../components/GardenDevicesTable";
import { ColumnsType } from "antd/es/table";
import { Select } from "antd";

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
  console.log(gardens)

  // danh sách khu vườn--------------------------

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

  const selectGarden = () => {
  };

  return (
    <div className="list_device">
      <header>
        <label>Danh sách thiết bị theo khu vườn: </label>
        <Select
          style={{ width: 200 }}
          // defaultValue={}
          onChange={selectGarden}
          options={[
            {
              value: "Tất cả",
              label: "Tất cả"
            },
          ]}
          placeholder={"Chọn khu vườn"}
        />
      </header>

      {gardenId && gardenDetail && (
        <div className="list_device_detail">
          <div className="list_device_detail_title">
            Danh sách thiết bị
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
