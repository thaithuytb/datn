import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Device } from "../../types/device.type";
import { DeviceTypeEnum, convertDeviceType } from "../../types/enum.type";
import { useNavigate, useParams } from "react-router-dom";
import { DeviceContext } from "../../contexts/DeviceContext";
import socketIOClient, { Socket } from "socket.io-client";
import DeviceApi from "../../api/device";

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<any>(null);
  const navigate = useNavigate();
  const deviceContext = useContext(DeviceContext);
  const gardenContext = useContext(GardenContext);
  const devices = deviceContext?.devices;
  const setDevices = deviceContext?.setDevices;
  const getDevicesByGardenId = deviceContext?.getDevicesByGardenId;
  const gardens = gardenContext?.gardens;

  const { gardenId } = useParams();

  useEffect(() => {
    gardenContext?.getGardens();
    const socket = socketIOClient(
      process.env.SERVER_WEB_SOCKET || "http://localhost:7000/device"
    );
    setSocket(socket);
    socket.on("newActuator", (data) => {
      console.log({ data });
      setMessage(data);
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
    if (!device.status) {
      return;
    }
    const deviceApi = DeviceApi.registerDeviceApi();
    if (convertTypeDevice(device.type) === "actuator") {
      deviceApi.changeDeviceStatus({
        status: !device.valueDevice.status,
        ip: device.ip,
        deviceId: device.id,
        type: device.type,
      });
    } else {
      deviceApi.changeDeviceStatus({
        ip: device.ip,
        deviceId: device.id,
        type: device.type,
      });
    }
  };

  console.log("aaaaa");

  return (
    <>
      {gardens && devices && (
        <div className="status_devices">
          <div className="list_device_select">
            <div>Khu vườn</div>
            <select onChange={selectGarden}>
              {gardens.map((garden) => (
                <option key={garden.id} value={garden.id}>
                  {garden.name}
                </option>
              ))}
            </select>
          </div>
          <div className="status_devices_present">
            <p>{">> "}Trạng thái hiện tại của thiết bị</p>
            <table className="status_devices_present_table">
              <tbody>
                <tr>
                  <th>Stt</th>
                  <th>Thiết bị</th>
                  <th>Trạng thái</th>
                  <th>Trạng thái/giá trị đo</th>
                  <th>Điều khiển thiết bị</th>
                </tr>
                {devices.map((device: Device, index: number) => {
                  let value;
                  let controlDevice;
                  if (device.type === "TEMPAIRSENSOR") {
                    value = (
                      <>
                        <p>Nhiet do: {device.valueDevice?.temp?.toFixed(2)}</p>
                        <p>
                          Do am: {device.valueDevice?.airHumidity?.toFixed(2)}
                        </p>
                      </>
                    );
                    controlDevice = (
                      <button
                        className="control_device"
                        onClick={() => changeStatusDevice(device)}
                      >
                        Do gia tri moi
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
                        Do gia tri moi
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

                  return (
                    <tr key={device.id}>
                      <td style={{ textAlign: "center" }}>{++index}</td>
                      <td>
                        {convertDeviceType[device.type].name} ({device.ip})
                      </td>
                      <td>
                        {device.status ? "Đang hoạt động" : "Không hoạt động"}
                      </td>
                      <td
                        className={device.type}
                        style={{ textAlign: "center" }}
                      >
                        {value}
                      </td>
                      <td
                        className={
                          device.status
                            ? `${device.status}`
                            : `${device.status} device_status_control`
                        }
                        style={{ textAlign: "center" }}
                      >
                        {controlDevice}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="history_DeviceDetail"></div>
        </div>
      )}
    </>
  );
}
