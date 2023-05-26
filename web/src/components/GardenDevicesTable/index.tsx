import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Device } from "../../types/device.type";
import { ColumnNameDeviceGarden } from "../../pages/ListDevice";

interface PropsGardenDevicesTable {
  columns: ColumnsType<ColumnNameDeviceGarden>;
  devices: Device[];
}

const GardenDevicesTable: React.FC<PropsGardenDevicesTable> = ({
  columns,
  devices,
}) => {
  let deviceInit = {
    FAN: {
      name: "Quạt",
      quantity: 0,
      key: "FAN",
    },
    LAMP: {
      name: "Đèn",
      quantity: 0,
      key: "LAMP",
    },
    NEBULIZER: {
      name: "Máy phun sương",
      quantity: 0,
      key: "NEBULIZER",
    },
    PUMP: {
      name: "Máy bơm",
      quantity: 0,
      key: "PUMP",
    },
    LIGHTSENSOR: {
      name: "Cảm biến ánh sáng",
      quantity: 0,
      key: "LIGHTSENSOR",
    },
    HUMISENSOR: {
      name: "Cảm biến độ ẩm đất",
      quantity: 0,
      key: "HUMISENSOR",
    },
    TEMPAIRSENSOR: {
      name: "Cảm biến nhiệt độ, độ ẩm",
      quantity: 0,
      key: "TEMPAIRSENSOR",
    },
  };

  for (const device of devices) {
    deviceInit[device.type] = {
      ...deviceInit[device.type],
      quantity: deviceInit[device.type].quantity + 1,
    };
  }

  const rows = Object.values(deviceInit).filter((row) => row.quantity !== 0);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={rows.map((row, index) => ({
          stt: ++index,
          ...row,
        }))}
        pagination={false}
        bordered={true}
      />
    </div>
  );
};

export default GardenDevicesTable;
