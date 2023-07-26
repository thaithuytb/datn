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

  // if (!device.status) {
  //   return <div style={{ color: "#999" }}>Không hoạt động</div>;
  // }

  return device?.status ? "Bật" : "Tắt";
};
