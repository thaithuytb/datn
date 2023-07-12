import { Device, convertDevice2Type } from "../types/device.type";

export const getMeasuredAndStatusDevice = (device: Device): any => {
  if (!device.status) {
    return <div style={{ color: "#999" }}>Không hoạt động</div>;
  }
  const deviceType = convertDevice2Type(device.type);
  if (deviceType === "SENSOR") {
    if (device.type === "TEMPAIRSENSOR") {
      return (
        <>
          <p>Nhiệt độ: {device.valueDevice?.temp?.toFixed(2)}</p>
          <p>Độ ẩm: {device.valueDevice?.airHumidity?.toFixed(2)}</p>
        </>
      );
    }
    return device.valueDevice?.value?.toFixed(2);
  }
  return device.valueDevice?.status ? "Bật" : "Tắt";
};
