import "./index.css";
import { useContext, useEffect } from "react";
import { GardenContext } from "../../contexts/GardenContext";
import { Device } from "../../types/device.type";
import { convertDeviceType } from "../../types/enum.type";
import { useNavigate, useParams } from "react-router-dom";

export default function StatusDevices() {
  const navigate = useNavigate();
  const gardenContext = useContext(GardenContext);
  const gardenDetail = gardenContext?.gardenDetail;
  const gardens = gardenContext?.gardens;

  const { gardenId } = useParams();

  useEffect(() => {
    if (gardenId) {
      gardenContext?.getGardenById(gardenId);
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
      {gardenDetail && (
        <div className="status_devices">
          <div className="list_device_select">
            <div>Khu vườn</div>
            <select onChange={selectGarden}>
              {gardens ? (
                gardens.map((garden) => (
                  <option key={garden.id} value={garden.id}>
                    {garden.name}
                  </option>
                ))
              ) : (
                <option>__Null__</option>
              )}
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
                {gardenDetail.devices.map((device: Device, index: number) => {
                  return (
                    <tr key={device.id}>
                      <td style={{ textAlign: "center" }}>{++index}</td>
                      <td>
                        {convertDeviceType[device.type].name} ({device.ip})
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {convertDeviceType[device.type].value}
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
