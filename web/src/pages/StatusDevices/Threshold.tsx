import { useEffect, useState } from "react";
import { Col, InputNumber, Row, Slider, Space } from "antd";
import { SliderMarks } from "antd/es/slider";
import DeviceApi from "../../api/device";

interface PropsThreshold {
  device?: any;
}
//type = ["HUMISENSOR", "LIGHTSENSOR", "TEMPAIRSENSOR"]
//[°C, %]

const Threshold: React.FC<PropsThreshold> = ({ device }) => {
  let unit = "°C";
  if (device.type === "HUMISENSOR") {
    unit = "%";
  }
  let min: number = 0;
  let max: number = 100;
  if (device.type === "LIGHTSENSOR") {
    min = 0;
    max = 5000;
  }
  const lowerThreshold = JSON.parse(device.lowThreshold.toString());
  const highThreshold = JSON.parse(device.highThreshold.toString());
  const [inputValue, setInputValue] = useState<any>([
    lowerThreshold[0],
    highThreshold[0],
  ]);
  const [inputValue2, setInputValue2] = useState<any>([
    lowerThreshold[1],
    highThreshold[1],
  ]);

  const onChange = (newValue: any) => {
    setInputValue(newValue);
  };

  const onChange2 = (newValue: any) => {
    setInputValue2(newValue);
  };

  const changeThreshold = async () => {
    let lowThreshold = [inputValue[0]];
    let highThreshold = [inputValue[1]];
    if (device.type === "TEMPAIRSENSOR") {
      lowThreshold = [inputValue[0], inputValue2[0]];
      highThreshold = [inputValue[1], inputValue2[1]];
    }
    const dto = {
      deviceId: device.id,
      ip: device.ip,
      lowerThreshold,
      highThreshold,
    };
    console.log(dto);
    try {
      const deviceApi = DeviceApi.registerDeviceApi();
      const res = await deviceApi.changeThreshold(dto);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const marks: SliderMarks = {
    [min]: `${min}${unit}`,
    [lowerThreshold[0]]: `${lowerThreshold[0]}${unit}`,
    [highThreshold[0]]: `${highThreshold[0]}${unit}`,
    [max]: `${max}${unit}`,
  };

  const marks2: SliderMarks = {
    [min]: `${min}%`,
    [lowerThreshold[1]]: `${lowerThreshold[1]}%`,
    [highThreshold[1]]: `${highThreshold[1]}%`,
    [max]: `${max}%`,
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: 600,
          marginBottom: 10,
          marginTop: "2rem",
        }}
      >
        <span>
          {device.id} {device.ip}
        </span>
        <button className="control_device" onClick={changeThreshold}>
          cập nhật
        </button>
      </div>
      <div>
        {device.type === "TEMPAIRSENSOR" ? (
          <div style={{ margin: 15, width: 600 }}>
            <div style={{ margin: 15, width: 600 }}>
              <Slider
                min={min}
                max={max}
                marks={marks}
                range={{ draggableTrack: true }}
                defaultValue={[lowerThreshold[0], highThreshold[0]]}
                onChange={onChange}
              />
            </div>
            <span style={{ margin: 10 }}></span>
            <div style={{ margin: 15, width: 600 }}>
              <Slider
                min={min}
                max={max}
                marks={marks2}
                range={{ draggableTrack: true }}
                defaultValue={[lowerThreshold[1], highThreshold[1]]}
                onChange={onChange2}
              />
            </div>
            <hr />
          </div>
        ) : (
          <div style={{ margin: 15, width: 600 }}>
            <Slider
              min={min}
              max={max}
              marks={marks}
              range={{ draggableTrack: true }}
              defaultValue={[lowerThreshold, highThreshold]}
              onChange={onChange}
            />
            <hr />
          </div>
        )}
      </div>
    </div>
  );
};

export default Threshold;
