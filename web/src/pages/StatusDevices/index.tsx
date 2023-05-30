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
import { DatePicker, Modal, TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import GardenApi from "../../api/garden";

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

  useEffect(() => {
    gardenContext?.getGardens();
    const socket = socketIOClient(
      process.env.SERVER_WEB_SOCKET || "http://localhost:7000/device"
    );
    setSocket(socket);
    socket.on("newStatus", (data) => {
      setMessage(data);
      console.log({ data });
      messageContext?.success("Cập nhập trạng thái mới thành công !!!");
    });

    socket.on("newStatusGarden", (data) => {
      if (data) {
        const newGardens = gardens?.map((garden) => {
          if (garden.id === data.gardenId) {
            return {
              ...garden,
              isAuto: data.isAuto,
            };
          }
          return garden;
        });
        setGardens(newGardens);
      }
      messageContext?.success("Cập nhập trạng thái mới thành công !!!");
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gardenId && getDevicesByGardenId) {
      getDevicesByGardenId(gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    if (devices && message) {
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

  useEffect(() => {
    if (gardens?.length) {
      navigate(`/status-devices/${gardens[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardens]);

  const selectGarden = (e: React.FormEvent) => {
    navigate(`/status-devices/${(e.target as any).value}`);
  };

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
    }
  };

  const garden = gardens?.find((garden) => garden.id.toString() === gardenId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00");
  const currentHour = moment().format("HH:mm");
  const currentDate = moment().format("DD-MM-YYYY");
  const [date, setDate] = useState(currentDate);
  const [hour, setHour] = useState(currentHour);
  const hourFormat = "HH:mm";
  const dateFormat = "DD-MM-YYYY";

  const changeDate = (date: any, dateString: any) => {
    setDate(dateString);
  };
  const changeHour = (time: any, timeString: any) => {
    setHour(timeString);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const isAuto = garden && !garden.isAuto;
    if (!date || !hour) {
      console.log("check time");
    } else {
      const [day, month] = date.split("-");

      // Xóa số 0 ở đầu ngày và tháng nếu có
      const formattedDay = parseInt(day, 10).toString();
      const formattedMonth = parseInt(month, 10).toString();
      const formattedDate = `${formattedDay}-${formattedMonth}`;

      const dto = {
        id: `${gardenId}`,
        req: {
          isAuto,
          time: `${formattedDate} ${hour}`,
        },
      };
      try {
        const gardenApi = GardenApi.registerAuthApi();
        const res = await gardenApi.changeStatusGarden(dto);
        console.log(res);
        setIsModalOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const changeMode = () => {
    showModal();
  };

  const duration = () => {
    // const startTime = `${currentDate} ${currentHour}`;
    // console.log({ startTime });
    // const endTime = `${date} ${hour}`;
    // console.log({ endTime });

    // console.log(2851080000 / (3600 * 24));

    // const dateTimeFormat = "DD-MM-YYYY HH:mm";

    // const startMoment = moment(startTime, dateTimeFormat);
    // const endMoment = moment(endTime, dateTimeFormat);

    // const duration = moment.duration(endMoment.diff(startMoment));
    // const days = duration.days();
    // const hours = duration.hours();
    // const minutes = duration.minutes();
    // console.log({ duration });
    // return `${hours}:${minutes}`;
    return "truong tinh";
  };

  useEffect(() => {
    setTimeRemaining(duration());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, date]);
  return (
    <>
      <Modal
        title="Xac nhan chuyen che do cham soc cua khu vuon sang ...."
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
              {currentDate} {currentHour}
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
                Ngay
                <DatePicker
                  defaultValue={dayjs(currentDate, dateFormat)}
                  format={dateFormat}
                  onChange={changeDate}
                />
              </div>
              <div style={{ margin: "0 1rem" }}>
                Gio
                <TimePicker
                  defaultValue={dayjs(currentHour, hourFormat)}
                  format={hourFormat}
                  onChange={changeHour}
                />
              </div>
              <div>
                So gio
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
      {gardens && devices && (
        <div className="status_devices">
          <div className="list_device_select">
            <div className="list_device_select_name">
              <div className="list_device_select_title">Khu vườn</div>
              <select onChange={selectGarden}>
                {gardens.map((garden) => (
                  <option key={garden.id} value={garden.id}>
                    {garden.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="list_device_select_regime">
              <div className="list_device_select_title">
                Chế độ chăm sóc hiện tại của khu vườn:
                <span style={{ color: "blue" }}>
                  {garden && garden.isAuto ? "auto" : "manual>"}
                </span>
              </div>
            </div>
            <div className="list_device_select_regime_change">
              <div className="list_device_select_title">
                Thay đổi chế độ:
                <button
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={changeMode}
                >
                  {garden && garden.isAuto
                    ? "Chuyển sang manual"
                    : "Chuyển sang auto>"}
                </button>
              </div>
            </div>
          </div>
          <div className="status_devices_present">
            <div>
              <p>{">> "}Trạng thái hiện tại của thiết bị</p>
              <table className="status_devices_present_table">
                <tbody>
                  <tr>
                    <th>Stt</th>
                    <th>Thiết bị</th>
                    <th>Trạng thái</th>
                    <th>Trạng thái/giá trị đo</th>
                    {garden && !garden.isAuto ? (
                      <th>Điều khiển thiết bị</th>
                    ) : null}
                  </tr>
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
                    } else {
                      value = device.valueDevice?.value
                        ? device.valueDevice?.value?.toFixed(2)
                        : device.valueDevice?.status
                        ? "Bật"
                        : "Tắt";
                      controlDevice = device.valueDevice?.value ? (
                        <></>
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
        </div>
      )}
    </>
  );
}
