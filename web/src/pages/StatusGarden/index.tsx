import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import {
  DEVICE_TYPE,
  Device,
  convertDevice2Type,
} from "../../types/device.type";
import { DeviceTypeEnum } from "../../types/enum.type";
import { useNavigate, useParams } from "react-router-dom";
import { DeviceContext } from "../../contexts/DeviceContext";
import DeviceApi from "../../api/device";
import { MessageContext } from "../../contexts/MessageContext";
import {
  DatePicker,
  Empty,
  Modal,
  Select,
  SelectProps,
  Table,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import GardenApi from "../../api/garden";
import Threshold from "./Threshold";
import { ColumnsType } from "antd/es/table";
import { getMeasuredAndStatusDevice } from "../../common/status-device";
import { SocketContext } from "../../contexts/SocketContext";
import { NotificationContext } from "../../contexts/NotificationContext";

interface DataType {
  stt: any;
  ip: string;
  status: any;
  type: string;
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

const ShowModal: React.FC<IShowModal> = ({
  isModalOpen,
  setIsModalOpen,
  gardenId,
  garden,
}) => {
  const dateFormat =''
  const timeFormat =''
  const currentDate = ''
  const currentTime= ''
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");

  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>();
  //hàm thay đổi chế độ
  const handleOk = async () => {
    const isAuto = garden && !garden.isAuto;
    if (!date || !time) {
      console.log("check time");
    } else {
      const [day, month] = date.split("-");

      // Xóa số 0 ở đầu ngày và tháng nếu có
      const formattedDay = parseInt(day, 10).toString();
      const formattedMonth = parseInt(month, 10).toString();
      const formattedDate = `${formattedDay}-${formattedMonth}`;

      const dto = {
        id: `${gardenId}`,
        body: {
          isAuto,
          time: `${formattedDate} ${time}`,
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
    const startTime = `${currentDate} ${currentTime}`;
    const endTime = `${date} ${time}`;
    const dateTimeFormat = "YYY-MM-DD HH:mm";

    const startMoment = moment(startTime, dateTimeFormat);
    const endMoment = moment(endTime, dateTimeFormat);

    const newTime = moment.duration(endMoment.diff(startMoment));
    const totalMinutes = newTime.asMinutes();
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes}`;
  };

  //mỗi khi lựa chọn thời gian hàm duration() được gọi lại
  useEffect(() => {
    setTimeRemaining(duration());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, date]);

  //nhận giá trị thời gian thay đổi
  const changeDate = (date: any, dateString: any) => {
    setDate(dateString);
  };
  const changeTime = (time: any, timeString: any) => {
    setTime(timeString);
  };
  console.log(currentDate)
  console.log(dateFormat)
  // console.log(dayjs(currentDate).format(dateFormat))
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
            {currentDate} {currentTime}
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
                // defaultValue={dayjs(currentDate, currentDate)}
                format={dateFormat}
                onChange={(date, dateString) => changeDate(date, dateString)}
              />
            </div>
            <div style={{ margin: "0 1rem" }}>
              Time
              <TimePicker
                // defaultValue={dayjs(currentTime, timeFormat)}
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

const convertTypeDevice = (type: DeviceTypeEnum) => {
  switch (type) {
    case "FAN":
    case "LAMP":
    case "CURTAIN":
    case "PUMP": {
      return "actuator";
    }
    default:
      return "sensor";
  }
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
  const [garden, setGarden] = useState<any>();
  const [dataTable, setDataTable] = useState<any>();
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;

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

  const changeStatusDevice = (device: Device) => {
    if (!device.status || !gardenId) {
      return;
    }
    const deviceApi = DeviceApi.registerDeviceApi();
    if (convertTypeDevice(device.type) === "actuator") {
      deviceApi.changeDeviceStatus(
        {
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

  //data table
  let columns: ColumnsType<DataType> = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 10,
      align: "center",
    },
    {
      title: "IP thiết bị",
      dataIndex: "ip",
      align: "center",
    },
    {
      title: "Loại thiết bị",
      dataIndex: "type",
      align: "center",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "Trạng thái/giá trị đo",
      dataIndex: "value",
      align: "center",
    },
  ];
  columns =
    garden && !garden.isAuto
      ? [
        ...columns,
        {
          title: "Điều khiển thiết bị",
          dataIndex: "",
          align: "center",
          render: (_, record) =>
            dataTable.length > 0 ? (
              convertDevice2Type(record.device.type) === "ACTUATOR" &&
                record.device.status ? (
                record.device.valueDevice?.status ? (
                  <button
                    className="control_device"
                    onClick={() => changeStatusDevice(record.device)}
                  >
                    Tắt
                  </button>
                ) : (
                  <button
                    className="control_device"
                    onClick={() => changeStatusDevice(record.device)}
                  >
                    Bật
                  </button>
                )
              ) : (
                "Không thể điều khiển"
              )
            ) : null,
        },
      ]
      : columns;

  useEffect(() => {
    const newData = devices?.map((device: Device, index: number) => ({
      key: index,
      stt: index + 1,
      ip: device.ip,
      status: device.status ? (
        "Đang hoạt động"
      ) : (
        <div style={{ color: "#999" }}>Không hoạt động</div>
      ),
      type: DEVICE_TYPE[`${device.type}`],
      value: getMeasuredAndStatusDevice(device),
      device,
    }));

    setDataTable(newData);
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
                <header className="list_device_select__header">
                  <div className="list_device_select__div_first">
                    <label>Chọn vườn: </label>
                    <Select
                      id="garden-select"
                      value={garden}
                      style={{ width: 150 }}
                      onChange={selectGarden}
                      options={itemsOption}
                      placeholder={"Chọn khu vườn"}
                    />
                  </div>
                  <div className="list_device_select__div_second">
                    <span>Chế độ chăm sóc :</span>
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
              <div style={{ marginTop: 10 }}>
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
              <ShowModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                garden={garden}
                gardenId={gardenId}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
