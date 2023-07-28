import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Device } from "../../types/device.type";
import { useNavigate, useParams } from "react-router-dom";
import { DeviceContext } from "../../contexts/DeviceContext";
import { MessageContext } from "../../contexts/MessageContext";
import {
  DatePicker,
  Empty,
  Modal,
  Select,
  SelectProps,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import GardenApi from "../../api/garden";
import Threshold from "./Threshold";
import Setup from "./Setup";
import { SocketContext } from "../../contexts/SocketContext";
import { NotificationContext } from "../../contexts/NotificationContext";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import DeviceApi from "../../api/device";
import StatusDevices from "./Status";

dayjs.extend(weekday);
dayjs.extend(localeData);

export const DEVICE_TYPE = {
  FAN: "Quạt",
  LAMP: "Đèn",
  CURTAIN: "Rèm",
  PUMP: "Máy bơm",
  LIGHT_SENSOR: "Cảm biến ánh sáng",
  HUMIDITY_SENSOR: "Cảm biến độ ẩm đất",
  TEMPERATURE_HUMIDITY_AIR_SENSOR: "Cảm biến nhiệt độ, độ ẩm",
};

export enum Type {
  FAN = "FAN",
  LAMP = "LAMP",
  CURTAIN = "CURTAIN",
  PUMP = "PUMP",
  LIGHT_SENSOR = "LIGHT_SENSOR",
  HUMIDITY_SENSOR = "HUMIDITY_SENSOR",
  TEMPERATURE_HUMIDITY_AIR_SENSOR = "TEMPERATURE_HUMIDITY_AIR_SENSOR",
}

export interface DataType {
  stt: number;
  id: number;
  type: Type;
  valueDevice: any;
  device: Device;
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

const convertTypeDevice = (type: string) => {
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
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm";
  const currentDate = dayjs();
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  //hàm thay đổi chế độ
  const handleOk = async () => {
    const isAuto = garden && !garden.isAuto;

    let timeInput = "99";

    if (date && time) {
      const [hours, minute] = time.split(":");
      const [year, month, day] = date.split("-");

      // Xóa số 0 ở đầu ngày và tháng nếu có
      const formattedDay = parseInt(day, 10).toString();
      const formattedMonth = parseInt(month, 10).toString();
      const formattedDate = `${formattedDay}-${formattedMonth}`;

      const formatHours = parseInt(hours, 10).toString();
      const formatMinute = parseInt(minute, 10).toString();
      const formattedTime = `${formatHours}:${formatMinute}`;
      timeInput = `${formattedDate} ${formattedTime}`;
    }
    if (date && !time) {
      timeInput = `${date} ${dayjs().format("HH:ss")}`;
    }
    if (!date && time) {
      timeInput = `${dayjs().format("DD-M")} ${time}`;
    }

    console.log(timeInput);

    const dto = {
      id: `${gardenId}`,
      body: {
        isAuto,
        time: timeInput,
      },
    };
    try {
      const gardenApi = GardenApi.registerAuthApi();
      await gardenApi.changeStatusGarden(dto);
      setIsModalOpen(false);
      setTimeRemaining("00:00");
    } catch (error) {}
  };
  const handleCancel = () => {
    setTimeRemaining("00:00");
    setIsModalOpen(false);
  };

  //hàm tính thời gian được chọn trừ đi thời gian hiện tại
  const duration = () => {
    const startTime = dayjs(`${currentDate.format("YYYY-MM-DD HH:mm")}`);
    let endTime = dayjs(`${currentDate.format("YYYY-MM-DD HH:mm")}`);
    if(date && time) {
      endTime = dayjs(`${date} ${time}`);
    } else if(date && !time) {
      endTime = dayjs(`${date} ${dayjs().format("HH:mm")}`);
    }else if(!date && time) {
      endTime = dayjs(`${dayjs().format("YYYY-MM-DD")} ${time}`);
    }
    const newTime = endTime.diff(startTime, "minute");
    const hours = Math.floor(newTime / 60);
    const minutes = newTime % 60;

    return `${`${hours}`}:${`${minutes}`}`;
  };

  useEffect(() => {
    if(date || time) {
      setTimeRemaining(duration());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, date]);

  const changeDate = (date: any, dateString: string) => {
    setDate(dateString);
  };
  const changeTime = (time: any, timeString: string) => {
    setTime(timeString);
  };

  console.log(date, time)
  console.log(timeRemaining)

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
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const [setup, setSetup] = useState<Device | undefined>();

  const notificationContext = useContext(NotificationContext);
  const setCount = notificationContext?.setCount;

  useEffect(() => {
    socket.on("newStatus", (data: any) => {
      console.log(data);
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
      messageContext?.success(
        `Chế độ chăm sóc vừa chuyển sang ${
          data?.isAuto ? "tự động" : "tự điều chỉnh"
        } !!!`
      );
    });
    socket.on("newCountNotification", (data: any) => {
      if (data) {
        setCount((count: number) => count + 1);
      }
    });
    //note return
    return () => {
      socket.off("newStatus");
      socket.off("newStatusGarden");
      socket.off("newCountNotification");
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

  const showModalSetup = (record: Device) => {
    setSetup(record);
    setIsModalOpenSetup(true);
  };

  const changeStatusDevice = (device: Device, time: string) => {
    if (!gardenId) {
      return;
    }
    const deviceApi = DeviceApi.registerDeviceApi();
    if (convertTypeDevice(device.type) === "actuator") {
      deviceApi.changeDeviceStatus(
        {
          time: time,
          status: !device.valueDevice.status,
          ip: device.ip,
          deviceId: device.id,
          type: device.type,
        },
        gardenId
      );
    } else {
      deviceApi.changeDeviceStatus(
        {
          ip: device.ip,
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
            createdAt: dayjs(),
            valueDevice: message,
          };
        }
        return device;
      });
      setDevices(newDevices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

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
                <h3>Chăm sóc khu vườn</h3>
                <header className="list_device_select__header">
                  <div className="list_device_select__div_first">
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
                    <span className="responsive-hiden">Chế độ chăm sóc:</span>
                    <button className="Button" onClick={changeMode}>
                      {garden && garden.isAuto ? "Tự động" : "Tự điều chỉnh"}
                    </button>
                  </div>
                </header>
              </div>

              {/* Trang thai thiet bi */}
              <StatusDevices
                changeStatusDevice={changeStatusDevice}
                showModalSetup={showModalSetup}
                devices={devices}
              />

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

              {/* ---------------- */}
              {isModalOpen && (
                <ShowModal
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  garden={garden}
                  gardenId={gardenId}
                />
              )}

              {isModalOpenSetup && (
                <Setup
                  isModalOpenSetup={isModalOpenSetup}
                  setIsModalOpenSetup={setIsModalOpenSetup}
                  setup={setup}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
