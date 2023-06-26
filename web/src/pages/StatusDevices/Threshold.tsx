import "./index.css";
import { SliderMarks } from "antd/es/slider";
import { Button, Slider } from "antd";


//[temperature, soil moisture, air humidity, light]
const Threshold: React.FC = () => {

  const temperature = (value: any) => { console.log(value) }
  const light = (value: any) => { console.log(value) }
  const soilMoisture = (value: any) => { console.log(value) }
  const airHumidity = (value: any) => { console.log(value) }

  // const marks: SliderMarks = {
  //   0: "0°C",
  //   [lowerThreshold[0]]: `${lowerThreshold}%`,
  //   [highThreshold[0]]: `${highThreshold}%`,
  //   100: "100°C",
  // };

  // const marks2: SliderMarks = {
  //   0: `0°C`,
  //   [lowerThreshold]: `${lowerThreshold}°C`,
  //   [highThreshold]: `${highThreshold}°C`,
  //   100: `100°C`,
  // };

  // const marks0: SliderMarks = {
  //   0: `0`,
  //   [lowerThreshold]: `${lowerThreshold}`,
  //   [highThreshold]: `${highThreshold}`,
  //   5000: `5000`,
  // };

  return (
    <div className="threshold">
      <div style={{ width: "72%" }}>
        <div className="threshold-children">
          <span>Ngưỡng nhiệt độ{`(°C): [30°C --> 40°C]`}</span>
          <div style={{ margin: 15, width: 300 }}>
            <Slider
              style={{ margin: "0" }}
              min={0}
              max={100}
              range={{ draggableTrack: true }}
              defaultValue={[30, 40]}
              onChange={temperature}
            />
          </div>
        </div>

        <div className="threshold-children">
          <span>Ngưỡng độ ẩm đất{`(%): [30% --> 40%]`}</span>
          <div style={{ margin: 15, width: 300 }}>
            <Slider
              style={{ margin: "0" }}
              min={0}
              max={100}
              // marks={marks}
              range={{ draggableTrack: true }}
              defaultValue={[30, 40]}
              onChange={soilMoisture}
            />
          </div>
        </div>

        <div className="threshold-children">
          <span>Ngưỡng độ ẩm không khí{`(%): [30 --> 40]`}</span>
          <div style={{ margin: 15, width: 300 }}>
            <Slider
              style={{ margin: "0" }}
              min={0}
              max={100}
              range={{ draggableTrack: true }}
              defaultValue={[30, 40]}
              onChange={airHumidity}
            />
          </div>
        </div>

        <div className="threshold-children">
          <span>Ngưỡng ánh sáng{`(°C): [30 --> 40]`}</span>
          <div style={{ margin: 15, width: 300 }}>
            <Slider
              style={{ margin: "0" }}
              min={0}
              max={100}
              range={{ draggableTrack: true }}
              defaultValue={[30, 40]}
              onChange={light}
            />
          </div>
        </div>
      </div>
      <Button>Cập nhật</Button>
    </div>

  );
};

export default Threshold;
