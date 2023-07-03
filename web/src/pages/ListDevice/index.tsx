import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { useNavigate, useParams } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { Select, SelectProps } from "antd";
import { ViewEmpty } from "../ManagementWorker";
import { DeviceContext } from "../../contexts/DeviceContext";

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
  const deviceContext = useContext(DeviceContext)
  const getDevicesByGardenId = deviceContext?.getDevicesByGardenId;
  
  const devices = deviceContext?.devices;
  const setDevices = deviceContext?.setDevices;
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const gardenContext = useContext(GardenContext);
  const gardenDetail = gardenContext?.gardenDetail;
  const gardens = gardenContext?.gardens;
  const [listDevice, setListDevice] = useState<ColumnNameDeviceGarden[]>()
  const [garden, setGarden] = useState<any>();
  console.log(gardenDetail)

  useEffect(() => {
    if (devices) {
      setListDevice(devices)
    }
  }, [devices]);

  useEffect(() => {
    if (gardenId && getDevicesByGardenId) {
      getDevicesByGardenId(gardenId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  const itemsOption: SelectProps["options"] =
    gardens?.map((garden, index: number) => ({
      id: garden.id,
      value: garden.name,
      label: garden.name,
    })) || [];

  //navigate đến khu vườn
  const selectGarden = (value: any, item: any) => {
    const garden = gardens?.find((garden) => garden.id === item.id);
    if (garden) {
      setGarden({
        ...item,
        isAuto: garden.isAuto,
      });
      navigate(`/management-devices/${item.id}`);
    } else {
      // setLisUser([]);
    }
  };

  useEffect(() => {
    gardenContext?.getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {gardens && !garden ? (
        <ViewEmpty selectGarden={selectGarden} itemsOption={itemsOption} />
      ) : (
        <div className="list_device">
          <header>
            <label>Chọn khu vườn: </label>
            <Select
              style={{ width: 200 }}
              value={garden}
              onChange={selectGarden}
              options={itemsOption}
              placeholder={"Chọn khu vườn"}
            />
          </header>
          <div className="list_device_detail">
            <div className="list_device_detail_title">Danh sách thiết bị</div>
            <Table
              bordered={true}
              columns={columns}
              dataSource={listDevice}
            />
          </div>

        </div>
      )}
    </div>
  );
}
