import "./index.css";
import { useContext, useEffect, useState } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Device } from "../../types/device.type";
import { convertDeviceType } from "../../types/enum.type";
import { useNavigate, useParams } from "react-router-dom";
import { DeviceContext } from "../../contexts/DeviceContext";
import socketIOClient, { Socket } from "socket.io-client";

export default function StatusDevices() {
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [message, setMessage] = useState("");

  useEffect(() => {
    // Kết nối tới server socket
    const socket = socketIOClient("http://localhost:7000/device");
    setSocket(socket);

    // Lắng nghe sự kiện "newFanStatus" từ server socket
    socket.on("newActuator", (data) => {
      console.log("Nhận dữ liệu từ server: ", data);
      // Cập nhật dữ liệu nhận được vào state
      // setMessage(JSON.stringify(data));
    });

    // Ngắt kết nối socket khi component bị hủy
    return () => {
      socket.disconnect();
    };
  }, []);

  const navigate = useNavigate();
  const deviceContext = useContext(DeviceContext);
  const gardenContext = useContext(GardenContext);
  const devices = deviceContext?.devices;
  const getDevicesByGardenId = deviceContext?.getDevicesByGardenId;
  const gardens = gardenContext?.gardens;

  const { gardenId } = useParams();

  useEffect(() => {
    if (gardenId && getDevicesByGardenId) {
      getDevicesByGardenId(gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    if (gardens?.length) {
      navigate(`/status-devices/${gardens[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardens]);

  useEffect(() => {
    gardenContext?.getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectGarden = (e: React.FormEvent) => {
    navigate(`/status-devices/${(e.target as any).value}`);
  };

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
                      <button className="control_device">Do gia tri moi</button>
                    );
                  } else {
                    value = device.valueDevice?.value
                      ? device.valueDevice?.value?.toFixed(2)
                      : device.valueDevice?.status
                      ? "Bật"
                      : "Tắt";
                    controlDevice = device.valueDevice?.value ? (
                      <button className="control_device">Do gia tri moi</button>
                    ) : device.valueDevice?.status ? (
                      <button className="control_device">Tắt</button>
                    ) : (
                      <button className="control_device">Bật</button>
                    );
                  }

                  return (
                    <tr key={device.id}>
                      <td style={{ textAlign: "center" }}>{++index}</td>
                      <td>
                        {convertDeviceType[device.type].name} ({device.ip})
                      </td>
                      <td style={{ textAlign: "center" }}>{value}</td>
                      <td style={{ textAlign: "center" }}>{controlDevice}</td>
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
