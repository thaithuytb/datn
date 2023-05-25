import "./index.css";
import { useContext } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Device } from "../../types/device.type";
import { convertDeviceType } from "../../types/enum.type";

export default function StatusDevices() {
  const gardenContext = useContext(GardenContext);
  const gardenDetail = gardenContext?.gardenDetail;

  return (
    <>
      {gardenDetail && (
        <div className="status_devices">
          <div className="status_devices_present">
            <p>{">> "}Trạng thái hiện tại của thiết bị</p>
            <table className="status_devices_present_table">
              <tr>
                <th>Stt</th>
                <th>Thiết bị</th>
                <th>Trạng thái/giá trị đo</th>
                <th>Điều khiển thiết bị</th>
              </tr>
              {gardenDetail.devices.map((device: Device, index: number) => {
                return (
                  <tr>
                    <td style={{ textAlign: "center" }}>{index}</td>
                    <td>
                      {convertDeviceType[device.type].name} ({device.ip})
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {convertDeviceType[device.type].value}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
          <div className="history_DeviceDetail"></div>
        </div>
      )}
    </>
  );
}
