import { Button } from "antd";

export const getMeasuredAndStatusDevice = (device: any, type: string): any => {
  if (type === "TEMPERATURE_HUMIDITY_AIR_SENSOR") {
    return (
      <>
        <div>Nhiệt độ: {device.humidityAir.toFixed(2)}°C</div>
        <div>Độ ẩm: {device.temperature.toFixed(2)}%</div>
      </>
    );
  } else if (type === "LIGHT_SENSOR") {
    return <div>Ánh sáng: {device.value.toFixed(2)}lux</div>;
  } else if (type === "HUMIDITY_SENSOR") {
    return <div>Độ ẩm đất: {device.value.toFixed(2)}lux</div>;
  }

  // return device?.status ?
  //   <Button type="primary" ghost size="small"
  //     style={{ padding: '0 1.2rem' }}
  //   >
  //     Bật
  //   </Button>
  //   :
  //   <Button type="primary" ghost size="small"
  //     style={{ padding: '0 1.2rem' }}
  //   >
  //     Tắt
  //   </Button>
};
