import "./index.css";
import { Slider, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { DeviceContext } from "../../contexts/DeviceContext";
import {
  IChangeThresholdDto,
  IThreshold,
  ThresholdNameEnum,
} from "../../types/threshold";
import dayjs from "dayjs";
import { DEVICE_TYPE, Type } from ".";
import ThresholdApi from "../../api/threshold";
import { MessageContext } from "../../contexts/MessageContext";
import { SocketContext } from "../../contexts/SocketContext";
// import { NotificationContext } from "../../contexts/NotificationContext";

const Threshold: React.FC<{ gardenId: string }> = ({ gardenId }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState<any>(null);
  const deviceContext = useContext(DeviceContext);
  const messageContext = useContext(MessageContext);
  const getThresholdsByGardenId = deviceContext?.getThresholdsByGardenId;
  const thresholds = deviceContext?.thresholds;
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const setThresholds = deviceContext?.setThresholds;
  // const notificationContext = useContext(NotificationContext)
  // const count = notificationContext?.count
  // const setCount = notificationContext?.setCount

  const [onChangeThresholdSlider, setOnChangeThresholdSlider] = useState({
    LIGHT_SENSOR: {
      lowThreshold: null,
      highThreshold: null,
    },
    HUMIDITY_SENSOR: {
      lowThreshold: null,
      highThreshold: null,
    },
    TEMPERATURE_HUMIDITY_AIR_SENSOR: {
      lowThreshold: [-100, -100],
      highThreshold: [-100, -100],
    },
  });

  useEffect(() => {
    if (gardenId && getThresholdsByGardenId) {
      getThresholdsByGardenId(+gardenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

  useEffect(() => {
    if (socket) {
      socket.on("newThreshold", (data: any) => {
        setMessage(data);
        messageContext?.success("Thay đổi ngưỡng thành công !!!");
      });
      // socket.on("newCountNotification", (data: any) => {
      //   if (data) {
      //     setCount((count: number) => count + 1)
      //   }
      // });
      //note return
      return () => {
        socket.off("newThreshold");
        // socket.off("newCountNotification")
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (thresholds && message) {
      const newThreshold = thresholds?.map((threshold) => {
        if (threshold.name === message.name) {
          return {
            ...threshold,
            lowThreshold: JSON.stringify(message.lowThreshold),
            highThreshold: JSON.stringify(message.highThreshold),
          };
        }
        return threshold;
      });
      setThresholds(newThreshold);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const onChangeThreshold = (
    value: number[],
    thresholdNameEnum: ThresholdNameEnum,
    numberOfTempAir?: 1 | 2
  ) => {
    if (!numberOfTempAir) {
      setOnChangeThresholdSlider({
        ...onChangeThresholdSlider,
        [thresholdNameEnum]: {
          lowThreshold: [value[0]],
          highThreshold: [value[1]],
        },
      });
    } else {
      if (numberOfTempAir === 1) {
        setOnChangeThresholdSlider({
          ...onChangeThresholdSlider,
          [Type.TEMPERATURE_HUMIDITY_AIR_SENSOR]: {
            lowThreshold: [
              value[0],
              onChangeThresholdSlider.TEMPERATURE_HUMIDITY_AIR_SENSOR
                .lowThreshold[1],
            ],
            highThreshold: [
              value[1],
              onChangeThresholdSlider.TEMPERATURE_HUMIDITY_AIR_SENSOR
                .highThreshold[1],
            ],
          },
        });
      } else {
        setOnChangeThresholdSlider({
          ...onChangeThresholdSlider,
          [Type.TEMPERATURE_HUMIDITY_AIR_SENSOR]: {
            lowThreshold: [
              onChangeThresholdSlider.TEMPERATURE_HUMIDITY_AIR_SENSOR
                .lowThreshold[0],
              value[0],
            ],
            highThreshold: [
              onChangeThresholdSlider.TEMPERATURE_HUMIDITY_AIR_SENSOR
                .highThreshold[0],
              value[1],
            ],
          },
        });
      }
    }
  };

  const updateThresholdAPi = async (thresholdNameEnum: Type) => {
    const thresholdApi = ThresholdApi.registerThresholdApi();
    if (thresholds) {
      const oldThresholdTemAir = thresholds.find(
        (threshold) => threshold.name === thresholdNameEnum
      );
      if (!oldThresholdTemAir) {
        return;
      }

      if (
        thresholdNameEnum === Type.LIGHT_SENSOR ||
        thresholdNameEnum === Type.HUMIDITY_SENSOR
      ) {
        if (
          onChangeThresholdSlider[thresholdNameEnum].lowThreshold ||
          onChangeThresholdSlider[thresholdNameEnum].highThreshold
        ) {
          // UPDATE HERE
          return await thresholdApi.changeThreshold({
            lowThreshold:
              onChangeThresholdSlider[thresholdNameEnum].lowThreshold ||
              JSON.parse(oldThresholdTemAir.lowThreshold.toString()),
            highThreshold:
              onChangeThresholdSlider[thresholdNameEnum].highThreshold ||
              JSON.parse(oldThresholdTemAir.highThreshold.toString()),
            name: thresholdNameEnum,
          });
        }
        return;
      }
      const lowThresholdTemAirOld = JSON.parse(
        oldThresholdTemAir.lowThreshold.toString()
      );
      const highThresholdTemAirOld = JSON.parse(
        oldThresholdTemAir.highThreshold.toString()
      );
      const newThresholdTemAir: IChangeThresholdDto = {
        name: Type.TEMPERATURE_HUMIDITY_AIR_SENSOR,
        // name: thresholdNameEnum.TEMPERATURE_HUMIDITY_AIR_SENSOR,
        lowThreshold:
          onChangeThresholdSlider.TEMPERATURE_HUMIDITY_AIR_SENSOR.lowThreshold.map(
            (x, index) =>
              (x !== -100 ? x : lowThresholdTemAirOld[index]) as number
          ),
        highThreshold:
          onChangeThresholdSlider.TEMPERATURE_HUMIDITY_AIR_SENSOR.highThreshold.map(
            (x, index) =>
              x !== -100 ? x : (highThresholdTemAirOld[index] as number)
          ),
      };

      // UPDATE
      return await thresholdApi.changeThreshold({ ...newThresholdTemAir });
    }
  };

  const columnsName: ColumnsType<IThreshold> = [
    {
      title: "Stt",
      dataIndex: "id",
      align: "center",
      width: 10,
      className: "responsive-hiden",
    },
    {
      title: "Cảm biến",
      align: "center",
      render: (_, threshold) => {
        // return DEVICE_TYPE[threshold.name];
        return DEVICE_TYPE[threshold.name];
      },
      className: "columns-table_threshold-type columns-table_status_devices",
    },
    {
      title: "Ngưỡng hiện tại",
      align: "center",
      className: "columns-table_status_devices",
      render: (_, threshold) => {
        // if (threshold.name === ThresholdNameEnum.TEMPAIRSENSOR) {
        if (threshold.name === Type.TEMPERATURE_HUMIDITY_AIR_SENSOR) {
          return (
            <>
              <div>
                Nhiệt độ: {JSON.parse(threshold.lowThreshold.toString())[0]}
                <span> &ndash; </span>
                {JSON.parse(threshold.highThreshold.toString())[0]}&deg;C
              </div>
              <div>
                Độ ẩm: {JSON.parse(threshold.lowThreshold.toString())[1]}
                <span> &ndash; </span>
                {JSON.parse(threshold.highThreshold.toString())[1]}%
              </div>
            </>
          );
        }
        return (
          <div>
            {JSON.parse(threshold.lowThreshold.toString())[0]}
            <span> &ndash; </span>
            {JSON.parse(threshold.highThreshold.toString())[0]}
            {threshold.name === Type.HUMIDITY_SENSOR ? "%" : "lux"}
          </div>
        );
      },
    },
    {
      title: "Cập nhật ngưỡng",
      align: "center",
      className: "columns-table_status_devices",
      render: (_, threshold) => {
        switch (threshold.name) {
          case Type.HUMIDITY_SENSOR: {
            const low = JSON.parse(threshold.lowThreshold.toString())[0];
            const hight = JSON.parse(threshold.highThreshold.toString())[0];
            return (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="threshold-children">
                  <span>0</span>
                  <div>
                    <Slider
                      style={{ margin: "0" }}
                      min={0}
                      max={100}
                      range={{ draggableTrack: true }}
                      defaultValue={[low, hight]}
                      onChange={(value: number[]) =>
                        onChangeThreshold(value, ThresholdNameEnum.HUMISENSOR)
                      }
                    />
                  </div>
                  <span style={{ paddingRight: 10 }}>100%</span>
                </div>
                <button
                  className="button_threshold"
                  onClick={() => updateThresholdAPi(Type.HUMIDITY_SENSOR)}
                >
                  Cập nhật
                </button>
              </div>
            );
          }
          case Type.LIGHT_SENSOR: {
            const low = JSON.parse(threshold.lowThreshold.toString())[0];
            const hight = JSON.parse(threshold.highThreshold.toString())[0];
            return (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="threshold-children">
                  <span>0</span>
                  <div>
                    <Slider
                      style={{ margin: "0" }}
                      min={0}
                      max={2000}
                      range={{ draggableTrack: true }}
                      defaultValue={[low, hight]}
                      onChange={(value: number[]) =>
                        onChangeThreshold(value, ThresholdNameEnum.LIGHTSENSOR)
                      }
                    />
                  </div>
                  <span>2000lux</span>
                </div>
                <button
                  className="button_threshold"
                  onClick={() => updateThresholdAPi(Type.LIGHT_SENSOR)}
                >
                  Cập nhật
                </button>
              </div>
            );
          }
          case Type.TEMPERATURE_HUMIDITY_AIR_SENSOR: {
            const lowTemp = JSON.parse(threshold.lowThreshold.toString())[0];
            const hightTemp = JSON.parse(threshold.highThreshold.toString())[0];
            const lowHumi = JSON.parse(threshold.lowThreshold.toString())[1];
            const hightHumi = JSON.parse(threshold.highThreshold.toString())[1];
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div className="threshold-children">
                    {/* <span style={{ paddingRight: 13 }}>Nhiệt độ:</span> */}
                    <span> 0</span>
                    <div>
                      <Slider
                        style={{ margin: "0" }}
                        min={0}
                        max={100}
                        range={{ draggableTrack: true }}
                        defaultValue={[lowTemp, hightTemp]}
                        onChange={(value: number[]) => {
                          onChangeThreshold(
                            value,
                            ThresholdNameEnum.TEMPAIRSENSOR,
                            1
                          );
                        }}
                      />
                    </div>
                    <span>100&deg;C</span>
                  </div>
                  <div className="threshold-children">
                    {/* <span style={{ paddingRight: 5, minWidth: 20 }}>
                      Độ ẩm k2:
                    </span> */}
                    <span> 0</span>
                    <div>
                      <Slider
                        style={{ margin: "0" }}
                        min={0}
                        max={100}
                        range={{ draggableTrack: true }}
                        defaultValue={[lowHumi, hightHumi]}
                        onChange={(value: number[]) => {
                          onChangeThreshold(
                            value,
                            ThresholdNameEnum.TEMPAIRSENSOR,
                            2
                          );
                        }}
                      />
                    </div>
                    <span>100%</span>
                  </div>
                </div>

                <button
                  className="button_threshold"
                  onClick={() =>
                    updateThresholdAPi(Type.TEMPERATURE_HUMIDITY_AIR_SENSOR)
                  }
                >
                  Cập nhật
                </button>
              </div>
            );
          }
          default: {
            return "NULL";
          }
        }
      },
    },
    {
      title: "Lần cập nhật mới nhất",
      align: "center",
      render: (_, threshold) => {
        return dayjs(threshold.updatedAt).format("YYYY-MM-DD");
      },
      className: "responsive-hiden",
    },
  ];
  return (
    <div className="threshold">
      {thresholds && (
        <Table
          pagination={false}
          columns={columnsName}
          dataSource={thresholds}
          bordered={true}
        />
      )}
    </div>
  );
};

export default Threshold;
