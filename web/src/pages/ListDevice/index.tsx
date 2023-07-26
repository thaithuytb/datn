import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { useNavigate, useParams } from "react-router-dom";
import Table, { ColumnsType } from "antd/es/table";
import { Button, Select, SelectProps } from "antd";
import { ViewEmpty } from "../ManagementWorker";
import { DeviceContext } from "../../contexts/DeviceContext";
export interface ColumnNameDeviceGarden {
  stt?: number;
  name: string;
  quantity: number;
  type: string | number;
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
  const gardens = gardenContext?.gardens;
  const [garden, setGarden] = useState<any>();

  const deviceContext = useContext(DeviceContext);
  const devices = deviceContext?.devices
  const getDevicesByGardenId = deviceContext?.getDevicesByGardenId;

  const dataTabale: {
    [key: string]: {
      stt: number;
      name: string;
      type: string;
      quantity: number;
    };
  } = {
    FAN: {
      stt: 1,
      name: "Quạt",
      type: "FAN",
      quantity: 0
    },
    LAMP: {
      stt: 2,
      name: "Đèn",
      type: "LAMP",
      quantity: 0
    },
    CURTAIN: {
      stt: 3,
      name: "Rèm",
      type: "CURTAIN",
      quantity: 0
    },
    PUMP: {
      stt: 4,
      name: "Máy bơm",
      type: "PUMP",
      quantity: 0
    },
    LIGHTSENSOR: {
      stt: 5,
      name: "Cảm biến ánh sáng",
      type: "LIGHTSENSOR",
      quantity: 0
    },
    HUMISENSOR: {
      stt: 6,
      name: "Cảm biến độ ẩm đất",
      type: "HUMISENSOR",
      quantity: 0
    },
    TEMPAIRSENSOR: {
      stt: 7,
      name: "Cảm biến nhiệt độ, độ ẩm",
      type: "TEMPAIRSENSOR",
      quantity: 0
    },
  }

  if (devices && gardenId) {
    for (const device of devices) {
      dataTabale[device.type] = {
        ...dataTabale[device.type],
        quantity: dataTabale[device.type].quantity + 1,
      };
    }
  }


  //looix warning
  const rows = Object.values(dataTabale).filter((row: ColumnNameDeviceGarden, index: number) => {
    return (
      row.quantity !== 0
    )
  });

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

  useEffect(() => {
    if (gardenId && getDevicesByGardenId) {
      getDevicesByGardenId(gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    const newGarden = gardens?.find((value) => value.id === Number(gardenId));
    if (newGarden) {
      setGarden({
        id: newGarden?.id,
        value: newGarden?.name,
        label: newGarden?.name,
        garden: newGarden,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardens]);

  const addNewDevice = () => {
    navigate('/management-devices/create', {
      state: {
        garden : garden,
        itemsOption: itemsOption
      }
    })
  }

  return (
    <div>
      {!gardenId ? (
        <ViewEmpty selectGarden={selectGarden} itemsOption={itemsOption} />
      ) : (
        <div className="list_device">
          <header>
            <div>
              <label>Chọn khu vườn: </label>
              <Select
                style={{ width: 200 }}
                value={garden}
                onChange={selectGarden}
                options={itemsOption}
                placeholder={"Chọn khu vườn"}
              />
            </div>
            <Button onClick={addNewDevice} type="primary" ghost>
              Thêm thiết bị mới
            </Button>
          </header>
          <div className="list_device_detail">
            <div className="list_device_detail_title">Danh sách thiết bị</div>
            <Table
              pagination={false}
              bordered={true}
              columns={columns}
              dataSource={rows}
            />
          </div>
        </div>
      )}
    </div>
  );
}
