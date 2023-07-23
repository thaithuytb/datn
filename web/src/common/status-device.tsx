
export const getMeasuredAndStatusDevice = (device: any, type: string): any => {
  console.log(type)
  if (type === "TEMPERATURE_HUMIDITY_AIR_SENSOR") {
    return (
      <>
        <p>Nhiệt độ: {device.humidityAir.toFixed(2)}</p>
        <p>Độ ẩm: {device.temperature.toFixed(2)}</p>
      </>
    );
  }

  else if (type === "LIGHT_SENSOR") {
    return (
      <>
        <p>Anh sang: {device.value.toFixed(2)}</p>
      </>
    );
  }

  else if (type === "HUMIDITY_SENSOR") {
    return (
      <>
        <p>Anh sang: {device.value.toFixed(2)}</p>
      </>
    );
  }

  if (!device.status) {
    return <div style={{ color: "#999" }}>Không hoạt động</div>;
  }

  // return device.valueDevice?.status ? "Bật" : "Tắt";
};
