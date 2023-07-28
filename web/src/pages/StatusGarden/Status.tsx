import React, { useState } from "react";
// import { getMeasuredAndStatusDevice } from "../../common/status-device";
import dayjs from "dayjs";
import { Device } from "../../types/device.type";
import { Button, DatePicker, Modal, TimePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
//import icon
import fan from "../../img/fan.png";
import lamp from "../../img/light-bulb.png";
import pump from "../../img/pump.png";
import light_sensor from "../../img/motion-sensor.png";
import humidity_sensor from "../../img/humidity.png";
import duration from "dayjs/plugin/duration";

dayjs.extend(customParseFormat);
dayjs.extend(duration);
interface PropsStatusDevices {
  devices: Device[];
  changeStatusDevice: (device: Device, time: string) => void;
  showModalSetup: (record: Device) => void;
}

interface PropsModalConfirm {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  changeStatusDevice: (device: Device, time: string) => void;
  device: Device;
}

const ModalConfirm: React.FC<PropsModalConfirm> = ({
  isModalOpen,
  setIsModalOpen,
  changeStatusDevice,
  device,
}) => {
  const [times, setTimes] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });

  const handleOk = async () => {
    const { date, time } = times;
    let timeInput = "99";
    if (date && time) {
      timeInput = `${date} ${time}`;
    }
    if (date && !time) {
      timeInput = `${date} ${dayjs().format("HH:ss")}`;
    }
    if (!date && time) {
      timeInput = `${dayjs().format("DD-M")} ${time}`;
    }
    try {
      await changeStatusDevice(device, timeInput);
      setIsModalOpen(false);
    } catch (error) {}
  };

  const changeTime = (time: any, timeString: string) => {
    setTimes({ ...times, time: timeString });
  };

  const changeDate = (time: any, dateString: string) => {
    setTimes({ ...times, date: dateString });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={`Ban co muon ${
        device.valueDevice.status ? "tat" : "bat"
      } trang thai thiet bi`}
      // width={650}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Đóng
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Cập nhật
        </Button>,
      ]}
    >
      {device.valueDevice.status ? null : (
        <>
          <div>
            Date
            <DatePicker
              defaultValue={dayjs(dayjs(), "DD-MM-YYYY")}
              format={"DD-M"}
              onChange={changeDate}
            />
          </div>
          <div style={{ margin: "0 1rem" }}>
            Time
            <TimePicker
              defaultValue={dayjs(dayjs(dayjs(), "HH:mm"))}
              format={"HH:mm"}
              onChange={changeTime}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

const convertIcon = (
  device: Device,
  showModalSetup: (record: Device) => void,
  setIsModalOpen: (isModalOpen: boolean) => void,
  setData: (data: Device | null) => void
) => {
  const openModal = () => {
    setData(device);
    setIsModalOpen(true);
  };

  switch (device.type) {
    case "FAN":
      return (
        <div className="setup-status">
          <img src={fan} alt="" />
          <div>
            {device.valueDevice.status ? (
              <button className="button_threshold" onClick={openModal}>
                Tắt{" "}
              </button>
            ) : (
              <button className="button_threshold" onClick={openModal}>
                Bật
              </button>
            )}
            <span onClick={() => showModalSetup(device)}>Thiết lập</span>
          </div>
        </div>
      );
    case "LAMP":
      return (
        <div className="setup-status">
          <img src={lamp} alt="" />
          <div>
            {device.valueDevice.status ? (
              <button className="button_threshold" onClick={openModal}>
                Tắt{" "}
              </button>
            ) : (
              <button className="button_threshold" onClick={openModal}>
                Bật
              </button>
            )}
            <span onClick={() => showModalSetup(device)}>Thiết lập</span>
          </div>
        </div>
      );
    case "CURTAIN":
      return <img src={fan} alt="" />;
    case "PUMP":
      return (
        <div className="setup-status">
          <img src={pump} alt="" />
          <div>
            {device.valueDevice.status ? (
              <button className="button_threshold" onClick={openModal}>
                Tắt{" "}
              </button>
            ) : (
              <button className="button_threshold" onClick={openModal}>
                Bật
              </button>
            )}
            <span onClick={() => showModalSetup(device)}>Thiết lập</span>
          </div>
        </div>
      );
    case "LIGHT_SENSOR":
      return <img className="setup-status_img" src={light_sensor} alt="" />;
    case "HUMIDITY_SENSOR":
      return <img className="setup-status_img" src={humidity_sensor} alt="" />;
    default:
      return <img className="setup-status_img" src={humidity_sensor} alt="" />;
  }
};

const convertNameToShow = (device: Device) => {
  switch (device.type) {
    case "FAN":
      return (
        <>
          {`Quạt đang ${device.valueDevice.status ? "bật" : "tắt"}`}
          <br />
          <br />
        </>
      );
    case "LAMP":
      return `Đèn đang ${device.valueDevice.status ? "bật" : "tắt"}`;
    case "PUMP":
      return `Bơm đang ${device.valueDevice.status ? "bật" : "tắt"}`;
    case "LIGHT_SENSOR":
      return <div>Ánh sáng {device.valueDevice.value?.toFixed(2)} lux</div>;
    case "HUMIDITY_SENSOR":
      return <div>Độ ẩm đất {device.valueDevice.value?.toFixed(2)} %</div>;
    case "TEMPERATURE_HUMIDITY_AIR_SENSOR":
      return (
        <>
          <div>Độ ẩm {device.valueDevice.humidityAir.toFixed(2)} % </div>
          <div>Nhiệt độ {device.valueDevice.temperature.toFixed(2)} °C </div>
        </>
      );
    default:
      console.log(`ERROR ${device.type}`);
      return null;
  }
};

const StatusDevices: React.FC<PropsStatusDevices> = ({
  devices,
  changeStatusDevice,
  showModalSetup,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Device | null>();

  return (
    <div className="StatusDevices">
      {devices.map((device: any, index: number) => {
        return (
          <div className="CardComponent" key={index}>
            {convertIcon(device, showModalSetup, setIsModalOpen, setData)}
            <div style={{ marginBottom: "1rem" }}>
              {convertNameToShow(device)}
              {/* {getMeasuredAndStatusDevice(device.valueDevice, device.type)} */}
            </div>
            <p className="CardComponent-date">
              {dayjs(device.createdAt).format("HH:mm DD-MM-YYYY")}
            </p>
          </div>
        );
      })}

      {isModalOpen && data && (
        <ModalConfirm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          changeStatusDevice={changeStatusDevice}
          device={data}
        />
      )}
    </div>
  );
};

export default StatusDevices;
