
export const getMeasuredAndStatusDevice = (device: any, type: string): any => {
  if (type === "TEMPERATURE_HUMIDITY_AIR_SENSOR") {
    return (
      <>
        <div>°C = {device.humidityAir.toFixed(2)}</div>
        <div>% = {device.temperature.toFixed(2)}</div>
      </>
    );
  } else if (type === "LIGHT_SENSOR") {
    return <div>lux = {device.value.toFixed(2)}</div>;
  } else if (type === "HUMIDITY_SENSOR") {
    return <div>% = {device.value.toFixed(2)}</div>;
  }
};
