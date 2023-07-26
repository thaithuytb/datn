
export const getMeasuredAndStatusDevice = (device: any, type: string): any => {
  if (type === "TEMPERATURE_HUMIDITY_AIR_SENSOR") {
    return (
      <>
        <div>Nhiệt độ: {device.humidityAir.toFixed(2)}°C</div>
        <div>Độ ẩm: {device.temperature.toFixed(2)}%</div>
      </>
    );
  }

  else if (type === "LIGHT_SENSOR") {
    return <div>Anh sang: {device.value.toFixed(2)}lux</div>
  }

  else if (type === "HUMIDITY_SENSOR") {
    return <div>Anh sang: {device.value.toFixed(2)}lux</div>
  }

  if (!device.status) {
    return <div style={{ color: "#999" }}>Không hoạt động</div>;
  }

  // return device.valueDevice?.status ? "Bật" : "Tắt";
};
