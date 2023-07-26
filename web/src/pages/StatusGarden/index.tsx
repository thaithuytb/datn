import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import {
  Device
} from "../../types/device.type";
import { useNavigate, useParams } from "react-router-dom";
import { DeviceContext } from "../../contexts/DeviceContext";
import { MessageContext } from "../../contexts/MessageContext";
import {
  Button,
  DatePicker,
  Empty,
  Modal,
  Select,
  SelectProps,
  Table,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import GardenApi from "../../api/garden";
import Threshold from "./Threshold";
import Setup from "./Setup";
import { ColumnsType } from "antd/es/table";
import { SocketContext } from "../../contexts/SocketContext";
import { NotificationContext } from "../../contexts/NotificationContext";
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import { getMeasuredAndStatusDevice } from "../../common/status-device";
import DeviceApi from "../../api/device";

dayjs.extend(weekday)
dayjs.extend(localeData)

export const DEVICE_TYPE = {
  FAN: "Quạt",
  LAMP: "Đèn",
  CURTAIN: "Rèm",
  PUMP: "Máy bơm",
  LIGHT_SENSOR: "Cảm biến ánh sáng",
  HUMIDITY_SENSOR: "Cảm biến độ ẩm đất",
  TEMPERATURE_HUMIDITY_AIR_SENSOR: "Cảm biến nhiệt độ, độ ẩm",
}

export enum Type {
  FAN = 'FAN',
  LAMP = 'LAMP',
  CURTAIN = 'CURTAIN',
  PUMP = 'PUMP',
  LIGHT_SENSOR = 'LIGHT_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  TEMPERATURE_HUMIDITY_AIR_SENSOR = 'TEMPERATURE_HUMIDITY_AIR_SENSOR',
}

export interface DataType {
  stt: number;
  id: number
  type: Type
  valueDevice: any
  device: Device
}
interface IViewEmpty {
  selectGarden: any;
  itemsOption: any;
}
interface IShowModal {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  garden: any;
  gardenId: any;
}

const convertTypeDevice = (type: Type) => {
  switch (type) {
    case "FAN":
    case "LAMP":
    case "PUMP": {
      return "actuator";
    }
    default:
      return "sensor";
  }
};

const ShowModal: React.FC<IShowModal> = ({
  isModalOpen,
  setIsModalOpen,
  gardenId,
  garden,
}) => {
  const dateFormat = 'YYYY-MM-DD'
  const timeFormat = 'HH:mm'
  const currentDate = dayjs()
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
  const [date, setDate] = useState<string>(currentDate.format(dateFormat));
  const [time, setTime] = useState<string>(currentDate.format(timeFormat));
  //hàm thay đổi chế độ
  const handleOk = async () => {
    const isAuto = garden && !garden.isAuto;
    if (!date || !time) {
      console.log("check time");
    } else {
      const [hours, minute] = time.split(":")
      const [year, month, day] = date.split("-");

      // Xóa số 0 ở đầu ngày và tháng nếu có
      const formattedDay = parseInt(day, 10).toString();
      const formattedMonth = parseInt(month, 10).toString();
      const formattedDate = `${formattedDay}-${formattedMonth}`;

      const formatHours = parseInt(hours, 10).toString()
      const formatMinute = parseInt(minute, 10).toString()
      const formattedTime = `${formatHours}:${formatMinute}`;

      const dto = {
        id: `${gardenId}`,
        body: {
          isAuto,
          time: `${formattedDate} ${formattedTime}`,
        },
      };
      try {
        const gardenApi = GardenApi.registerAuthApi();
        await gardenApi.changeStatusGarden(dto);
        setIsModalOpen(false);
        setTimeRemaining("00:00");
      } catch (error) { }
    }
  };
  const handleCancel = () => {
    setTimeRemaining("00:00");
    setIsModalOpen(false);
  };

  //hàm tính thời gian được chọn trừ đi thời gian hiện tại
  const duration = () => {
    const startTime = dayjs(`${currentDate.format('YYYY-MM-DD HH:mm')}`);
    const endTime = dayjs(`${date} ${time}`);

    const newTime = endTime.diff(startTime, 'minute');
    const hours = Math.floor(newTime / 60);
    const minutes = newTime % 60;

    return `${`${hours}`}:${`${minutes}`}`;
  };

  useEffect(() => {
    setTimeRemaining(duration());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, date]);

  const changeDate = (date: any, dateString: string) => {
    setDate(dateString);
  };
  const changeTime = (time: any, timeString: string) => {
    setTime(timeString);
  };

  return (
    <Modal
      title="Bạn muốn chuyển chế độ!!!"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {garden && !garden.isAuto ? (
        ""
      ) : (
        <>
          <div>
            Thời gian hiện tại<br></br>
            {currentDate.format(dateFormat)} {currentDate.format(timeFormat)}
          </div>
          <div style={{ marginTop: "1.3rem" }}>Thời gian quay lại auto</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0rem",
            }}
          >
            <div>
              Date
              <DatePicker
                defaultValue={dayjs(currentDate, dateFormat)}
                format={dateFormat}
                onChange={changeDate}
              />
            </div>
            <div style={{ margin: "0 1rem" }}>
              Time
              <TimePicker
                defaultValue={dayjs(currentDate, timeFormat)}
                format={timeFormat}
                onChange={changeTime}
              />
            </div>
            <div>
              Duration
              <div
                style={{
                  width: "100px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  padding: "4px 11px 4px",
                }}
              >
                {timeRemaining}
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

const ViewEmpty: React.FC<IViewEmpty> = ({ selectGarden, itemsOption }) => {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 280 }}
      description={
        <div>
          Chọn khu vườn
          <br /> <br />
          <Select
            id="garden-select"
            style={{ width: 200 }}
            onChange={selectGarden}
            options={itemsOption}
            placeholder={"Chọn khu vườn"}
          />
        </div>
      }
    ></Empty>
  );
};

export default function StatusGardens() {
  const [message, setMessage] = useState<any>(null);
  const navigate = useNavigate();
  const deviceContext = useContext(DeviceContext);
  const gardenContext = useContext(GardenContext);
  const devices = deviceContext?.devices;
  const setDevices = deviceContext?.setDevices;
  const getDevicesByGardenId = deviceContext?.getDevicesByGardenId;
  const gardens = gardenContext?.gardens;
  const setGardens = gardenContext?.setGardens;
  const messageContext = useContext(MessageContext);
  const { gardenId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenSetup, setIsModalOpenSetup] = useState<boolean>(false);
  const [garden, setGarden] = useState<any>();
  const [dataTable, setDataTable] = useState<any>();
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const [setup, setSetup] = useState<DataType | undefined>()

  const notificationContext = useContext(NotificationContext)
  const setCount = notificationContext?.setCount

  useEffect(() => {
    socket.on("newStatus", (data: any) => {
      setMessage(data);
      messageContext?.success("Cập nhập trạng thái mới thành công !!!");
    });
    socket.on("newStatusGarden", (data: any) => {
      if (data) {
        //update lại toàn bộ khu vườn
        setGardens((gardens: any) =>
          gardens?.map((garden: any) => {
            if (garden.id === data.gardenId) {
              return {
                ...garden,
                isAuto: data.isAuto,
              };
            }
            return garden;
          })
        );

      }
      messageContext?.success("Cập nhập trạng thái mới thành công !!!");
    });
    socket.on("newCountNotification", (data: any) => {
      if (data) {
        setCount((count: number) => count + 1)
      }
    });
    //note return
    return () => {
      socket.off("newStatus");
      socket.off("newStatusGarden");
      socket.off("newCountNotification")
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  useEffect(() => {
    //lấy toàn bộ khu vườn
    gardenContext?.getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //refreshtUrl
  useEffect(() => {
    const newGarden = gardens?.find((value) => value.id === Number(gardenId));
    if (newGarden) {
      setGarden({
        id: newGarden?.id,
        value: newGarden?.name,
        label: newGarden?.name,
        isAuto: newGarden.isAuto,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardens]);

  ////phần header------------------------------------------------------------
  const itemsOption: SelectProps["options"] =
    gardens?.map((garden) => ({
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
      navigate(`/status-gardens/${item.id}`);
    } else {
      // setLisUser([]);
    }
  };

  //mở modal để chuyển chế độ
  const changeMode = () => {
    showModal();
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalSetup = (record: DataType) => {
    setSetup(record)
    setIsModalOpenSetup(true);
  };


  const changeStatusDevice = (device: DataType) => {
    if (!gardenId) {
      return;
    }
    const deviceApi = DeviceApi.registerDeviceApi();
    if (convertTypeDevice(device.type) === "actuator") {
      deviceApi.changeDeviceStatus(
        {
          status: !device.valueDevice.status,
          ip: device.device.ip,
          deviceId: device.id,
          type: device.type,
        },
        gardenId
      );
    } else {
      deviceApi.changeDeviceStatus(
        {
          ip: device.device.ip,
          deviceId: device.id,
          type: device.type,
        },
        gardenId
      );
    }
  };
  
  useEffect(() => {
    if (gardenId && getDevicesByGardenId) {
      getDevicesByGardenId(gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    if (devices && message) {
      const newDevices = devices.map((device: Device) => {
        if (device.ip === message.ip) {
          return {
            ...device,
            valueDevice: message,
          };
        }
        return device;
      });
      setDevices(newDevices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);


  //data table
  let columns: ColumnsType<DataType> = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 10,
      align: "center",
      className: "responsive-hiden"
    },
    {
      title: "Loại thiết bị",
      dataIndex: "type",
      align: "center",
      render: (_, record: DataType) => DEVICE_TYPE[record.type],
      className: "columns-table_status_devices columns-table_status_devices-type"
    },
    {
      title: "Gia tri",
      dataIndex: "valueDevice",
      align: "center",
      className: 'columns-table_status_devices'
    },
  ];

  columns =
    garden && !garden.isAuto
      ? [
        ...columns,
        {
          title: "Điều khiển",
          dataIndex: "",
          align: "center",
          render: (_, record: DataType) =>
            dataTable.length > 0 ? (
              record.device.type === "TEMPERATURE_HUMIDITY_AIR_SENSOR" ?
                <button
                  className="control_device"
                  onClick={() => changeStatusDevice(record)}
                >
                  Đo giá trị
                </button>
                :
                record.device.valueDevice?.value ? (
                  <button
                    className="control_device"
                    onClick={() => changeStatusDevice(record)}
                  >
                    Đo giá trị
                  </button>
                ) : record.device.valueDevice?.status ? (
                  <button
                    className="control_device"
                    onClick={() => changeStatusDevice(record)}
                  >
                    Tắt
                  </button>
                ) : (
                  <button
                    className="control_device"
                    onClick={() => changeStatusDevice(record)}
                  >
                    Bật
                  </button>
                )
            ) : null,
          // width: 150
          className: 'columns-table_status_devices'
        },
        {
          title: "Thiet lap trang thai",
          dataIndex: "",
          align: "center",
          render: (_, record: DataType) =>
            dataTable.length > 0 ? (
              record.type === 'FAN' || record.type === 'LAMP' || record.type === 'PUMP' ?
                <Button size="small" ghost type="primary" onClick={() => showModalSetup(record)}>Thiet lap</Button>
                : null
            ) : null,
          // width: 200
          className: 'columns-table_status_devices-button'
        },
      ]
      :
      [
        ...columns,
        {
          title: "Thiet lap trang thai",
          dataIndex: "",
          align: "center",
          render: (_, record: DataType) =>
            dataTable.length > 0 ? (
              record.type === 'FAN' || record.type === 'LAMP' || record.type === 'PUMP' ?
                <Button size="small" ghost type="primary" onClick={() => showModalSetup(record)}>Thiet lap</Button>
                : null
            ) : null,
          // width: 200
          className: 'columns-table_status_devices-button'
        },
      ];

  useEffect(() => {
    if (devices) {
      const newData = devices.map((device: Device, index: number) => (
        {
          key: index,
          stt: index + 1,
          id: device.id,
          type: device.type,
          valueDevice: getMeasuredAndStatusDevice(device.valueDevice, device.type),
          device: device
        }
      ))
      setDataTable(newData)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);

  return (
    <>
      {!gardenId ? (
        <ViewEmpty selectGarden={selectGarden} itemsOption={itemsOption} />
      ) : (
        <>
          {gardens && devices && (

            <div className="status_devices">
              {/* header */}
              <div className="list_device_select">
                <h3>Cham soc khu vuon</h3>
                <header className="list_device_select__header">
                  <div className="list_device_select__div_first">
                    <label className="responsive-hiden">Chọn vườn: </label>
                    <Select
                      id="garden-select"
                      value={garden}
                      style={{ width: 200 }}
                      onChange={selectGarden}
                      options={itemsOption}
                      placeholder={"Chọn khu vườn"}
                    />
                  </div>
                  <div className="list_device_select__div_second">
                    <span className="responsive-hiden">Chế độ chăm sóc :</span>
                    <button className="Button" onClick={changeMode}>
                      {garden && garden.isAuto ? "Tự động" : "Tự điều chỉnh"}
                    </button>
                  </div>
                </header>
              </div>

              {/* xét ngưỡng các thiết bị */}
              {gardenId && (
                <div
                  className="threshold_DeviceDetail"
                  style={{ marginBottom: 20 }}
                >
                  <h3
                    style={{
                      fontWeight: 500,
                      fontSize: "18px",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ color: "red" }}>&#10052; </span>
                    Giới hạn cảm biến
                  </h3>
                  <div>
                    <Threshold gardenId={gardenId} />
                  </div>
                </div>
              )}
              {/* bảng trạng thái thiết bị */}
              <div className="table-status_devices">
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: "18px",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ color: "red" }}>&#10052;</span> Trạng thái hiện
                  tại của thiết bị
                </h3>
                {/* phần bảng */}
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={dataTable}
                  bordered={true}
                />
              </div>

              {/* ---------------- */}
              {isModalOpen &&
                <ShowModal
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  garden={garden}
                  gardenId={gardenId}
                />
              }

              {isModalOpenSetup &&
                <Setup
                  isModalOpenSetup={isModalOpenSetup}
                  setIsModalOpenSetup={setIsModalOpenSetup}
                  setup={setup}
                />
              }
            </div>
          )}
        </>
      )}
    </>
  );
}
