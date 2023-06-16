import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Device } from "../../types/device.type";
import { DeviceTypeEnum, convertDeviceType } from "../../types/enum.type";
import { useNavigate, useParams } from "react-router-dom";
import { DeviceContext } from "../../contexts/DeviceContext";
import socketIOClient, { Socket } from "socket.io-client";
import DeviceApi from "../../api/device";
import { MessageContext } from "../../contexts/MessageContext";
import { DatePicker, Modal, Select, SelectProps, TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import GardenApi from "../../api/garden";
import Threshold from "./Threshold";

interface IShowModal {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  garden: any;
  timeRemaining: string;
  setTimeRemaining: (timeRemaining: string) => void;
  setDate: (data: string) => void;
  date: string;
  setTime: (time: string) => void;
  time: string;
  currentTime: any;
  currentDate: any;
  timeFormat: any;
  dateFormat: any;
  gardenId: any;
}

const ShowModal: React.FC<IShowModal> = ({
  isModalOpen,
  setIsModalOpen,
  gardenId,
  garden,
  timeRemaining,
  setTimeRemaining,
  date,
  setDate,
  time,
  setTime,
  currentTime,
  currentDate,
  timeFormat,
  dateFormat,
}) => {
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
      } catch (error) {
        console.log(error);
      }
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
    const dateTimeFormat = "DD-MM-YYYY HH:mm";

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
                defaultValue={dayjs(currentDate, dateFormat)}
                format={dateFormat}
                onChange={changeDate}
              />
            </div>
            <div style={{ margin: "0 1rem" }}>
              Time
              <TimePicker
                defaultValue={dayjs(currentTime, timeFormat)}
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
    case "NEBULIZER":
    case "PUMP": {
      return "actuator";
    }
    default:
      return "sensor";
  }
};

export default function StatusDevices() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<any>(null);
  const [thresholdsDisplay, setThresholdsDisplay] = useState("none");
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
  const currentTime = moment().format("HH:mm");
  const currentDate = moment().format("DD-MM-YYYY");
  const [date, setDate] = useState<string>(currentDate);
  const [time, setTime] = useState<string>(currentTime);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
  const timeFormat = "HH:mm";
  const dateFormat = "DD-MM-YYYY";

  console.log(gardenId);
  useEffect(() => {
    //lấy toàn bộ khu vườn
    gardenContext?.getGardens();

    //setup socket
    const socket = socketIOClient(
      process.env.SERVER_WEB_SOCKET || "http://localhost:7000/device"
    );
    setSocket(socket);
    socket.on("newStatus", (data) => {
      setMessage(data);
      console.log({ data });
      messageContext?.success("Cập nhập trạng thái mới thành công !!!");
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //nhận lại socket khi thay đổi chế độ
  useEffect(() => {
    const socket = socketIOClient(
      process.env.SERVER_WEB_SOCKET || "http://localhost:7000/device"
    );
    socket.on("newStatusGarden", (data) => {
      if (data) {
        const newgardens = gardens?.map((garden) => {
          if (garden.id === data.gardenId) {
            return {
              ...garden,
              isAuto: data.isAuto,
            };
          }
          return garden;
        });
        //update lại toàn bộ khu vườn
        setGardens(newgardens);
      }
      messageContext?.success("Cập nhập trạng thái mới thành công !!!");
    });

    return () => {
      socket.disconnect();
    };
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
    navigate(`/status-devices/${item.id}`);
  };

  //mở modal để chuyển chế độ
  const changeMode = () => {
    showModal();
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  //đóng mở phần xét ngưỡng------------------------------
  const hiden = () => {
    thresholdsDisplay === "none"
      ? setThresholdsDisplay("block")
      : setThresholdsDisplay("none");
  };

  useEffect(() => {
    if (gardenId && getDevicesByGardenId) {
      getDevicesByGardenId(gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    if (devices && message) {
      console.log("aaaaaaaaaaaaaaaaaa");
      const newDevices = devices.map((device: Device) => {
        if (device.id === message.deviceId) {
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

  //moi khi vao se vao khu vuon 1
  useEffect(() => {
    if (gardens?.length) {
      navigate(`/status-devices/${gardens[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const garden = gardens?.find((garden) => garden.id.toString() === gardenId);

  return (
    <>
      {gardens && devices && (
        <div className="status_devices">
          {/* header */}
          <div className="list_device_select">
            <header>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <label>Khu vườn: </label>
                <Select
                  id="garden-select"
                  value={garden?.name}
                  style={{ width: 150 }}
                  onChange={selectGarden}
                  options={itemsOption}
                  placeholder={"Chọn khu vườn"}
                />
                <label>
                  Đang ở chế độ{" "}
                  <span style={{ color: "blue" }}>
                    {garden && garden.isAuto ? "auto" : "manual>"}
                  </span>
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                Chuyển chế độ{" "}
                <span className="Button">
                  <button onClick={changeMode}>
                    {garden && garden.isAuto
                      ? "Chuyển sang manual"
                      : "Chuyển sang auto>"}
                  </button>
                </span>
              </div>
            </header>
          </div>

          {/* xét ngưỡng các thiết bị */}
          <div className="threshold_DeviceDetail">
            <h3>{">> "}Ngưỡng phù hợp cho khu vườn</h3>
            <p onClick={hiden} style={{ cursor: "pointer" }}>
              Xem chi tiết
            </p>
            <div style={{ display: thresholdsDisplay }}>
              <Threshold />
            </div>
          </div>

          {/* bảng trạng thái thiết bị */}
          <div className="status_devices_present">
            <div>
              <h3>{">> "}Trạng thái hiện tại của thiết bị</h3>
              {/* phần bảng */}
              <table className="status_devices_present_table">
                <tbody>
                  {/* hàng tiêu đề của cột */}
                  <tr>
                    <th>Stt</th>
                    <th>Thiết bị</th>
                    <th>Trạng thái</th>
                    <th>Trạng thái/giá trị đo</th>
                    {garden && !garden.isAuto ? (
                      <th>Điều khiển thiết bị</th>
                    ) : null}
                  </tr>
                  {/* -------------- */}
                  {devices.map((device: Device, index: number) => {
                    let value;
                    let controlDevice;
                    if (device.type === "TEMPAIRSENSOR") {
                      value = (
                        <>
                          <p>
                            Nhiệt độ: {device.valueDevice?.temp?.toFixed(2)}
                          </p>
                          <p>
                            Độ ẩm: {device.valueDevice?.airHumidity?.toFixed(2)}
                          </p>
                        </>
                      );
                      controlDevice = (
                        <button
                          className="control_device"
                          onClick={() => changeStatusDevice(device)}
                        >
                          Đo giá trị mới
                        </button>
                      );
                    } else {
                      value = device.valueDevice?.value
                        ? device.valueDevice?.value?.toFixed(2)
                        : device.valueDevice?.status
                        ? "Bật"
                        : "Tắt";
                      controlDevice = device.valueDevice?.value ? (
                        <button
                          className="control_device"
                          onClick={() => changeStatusDevice(device)}
                        >
                          Đo giá trị mới
                        </button>
                      ) : device.valueDevice?.status ? (
                        <button
                          className="control_device"
                          onClick={() => changeStatusDevice(device)}
                        >
                          Tắt
                        </button>
                      ) : (
                        <button
                          className="control_device"
                          onClick={() => changeStatusDevice(device)}
                        >
                          Bật
                        </button>
                      );
                    }

                    if (!device.status) {
                      value = "Không có dữ liệu";
                      controlDevice = "Không có dữ liệu";
                    }

                    return (
                      <tr key={device.id}>
                        <td style={{ textAlign: "center" }}>{++index}</td>
                        <td>
                          {convertDeviceType[device.type].name} ({device.ip})
                        </td>
                        <td className={device.status ? "" : "device_no_action"}>
                          {device.status ? "Đang hoạt động" : "Không hoạt động"}
                        </td>
                        <td
                          className={
                            device.status
                              ? `${device.type}`
                              : `${device.type} device_no_action`
                          }
                          style={{ textAlign: "center" }}
                        >
                          {value}
                        </td>
                        {garden && !garden.isAuto ? (
                          <td
                            className={
                              device.status
                                ? `${device.status}`
                                : `${device.status} device_status_control device_no_action`
                            }
                            style={{ textAlign: "center" }}
                          >
                            {controlDevice}
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ---------------- */}
          <ShowModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            garden={garden}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            currentTime={currentTime}
            currentDate={currentDate}
            timeFormat={timeFormat}
            dateFormat={dateFormat}
            gardenId={gardenId}
          />
        </div>
      )}
    </>
  );
}
