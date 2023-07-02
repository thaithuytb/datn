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
import { DEVICE_TYPE } from "../../types/device.type";
import ThresholdApi from "../../api/threshold";
import { MessageContext } from "../../contexts/MessageContext";
import { SocketContext } from "../../contexts/SocketContext";

const Threshold: React.FC<{ gardenId: string }> = ({ gardenId }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deviceContext = useContext(DeviceContext);
  const messageContext = useContext(MessageContext);
  const getThresholdsByGardenId = deviceContext?.getThresholdsByGardenId;
  const thresholds = deviceContext?.thresholds;
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const setThresholds = deviceContext?.setThresholds;

  const [onChangeThresholdSlider, setOnChangeThresholdSlider] = useState({
    LIGHTSENSOR: {
      lowThreshold: null,
      highThreshold: null,
    },
    HUMISENSOR: {
      lowThreshold: null,
      highThreshold: null,
    },
    TEMPAIRSENSOR: {
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
        console.log("aaaaaaa", data);
        // setThresholds(data);
        messageContext?.success("Thay đổi ngưỡng thành công !!!");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
          [ThresholdNameEnum.TEMPAIRSENSOR]: {
            lowThreshold: [
              value[0],
              onChangeThresholdSlider.TEMPAIRSENSOR.lowThreshold[1],
            ],
            highThreshold: [
              value[1],
              onChangeThresholdSlider.TEMPAIRSENSOR.highThreshold[1],
            ],
          },
        });
      } else {
        setOnChangeThresholdSlider({
          ...onChangeThresholdSlider,
          [ThresholdNameEnum.TEMPAIRSENSOR]: {
            lowThreshold: [
              onChangeThresholdSlider.TEMPAIRSENSOR.lowThreshold[0],
              value[0],
            ],
            highThreshold: [
              onChangeThresholdSlider.TEMPAIRSENSOR.highThreshold[0],
              value[1],
            ],
          },
        });
      }
    }
  };

  const updateThresholdAPi = (thresholdNameEnum: ThresholdNameEnum) => {
    const thresholdApi = ThresholdApi.registerThresholdApi();
    if (thresholds) {
      const oldThresholdTemAir = thresholds.find(
        (threshold) => threshold.name === thresholdNameEnum
      );
      if (!oldThresholdTemAir) {
        return;
      }
      if (
        thresholdNameEnum === ThresholdNameEnum.LIGHTSENSOR ||
        thresholdNameEnum === ThresholdNameEnum.HUMISENSOR
      ) {
        if (
          onChangeThresholdSlider[thresholdNameEnum].lowThreshold ||
          onChangeThresholdSlider[thresholdNameEnum].highThreshold
        ) {
          //UPDATE HERE
          return thresholdApi.changeThreshold({
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
        name: ThresholdNameEnum.TEMPAIRSENSOR,
        lowThreshold: onChangeThresholdSlider.TEMPAIRSENSOR.lowThreshold.map(
          (x, index) =>
            (x !== -100 ? x : lowThresholdTemAirOld[index]) as number
        ),
        highThreshold: onChangeThresholdSlider.TEMPAIRSENSOR.highThreshold.map(
          (x, index) =>
            x !== -100 ? x : (highThresholdTemAirOld[index] as number)
        ),
      };
      // UPDATE
      return thresholdApi.changeThreshold({ ...newThresholdTemAir });
      // console.log({ newThresholdTemAir });
    }
  };

  const columnsName: ColumnsType<IThreshold> = [
    {
      title: "Stt",
      dataIndex: "id",
      align: "center",
      width: 10,
    },
    {
      title: "Cảm biến",
      align: "center",
      render: (_, threshold) => {
        return DEVICE_TYPE[threshold.name];
      },
    },
    {
      title: "Ngưỡng hiện tại",
      align: "center",
      render: (_, threshold) => {
        if (threshold.name === ThresholdNameEnum.TEMPAIRSENSOR) {
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
            {threshold.name === ThresholdNameEnum.HUMISENSOR ? "%" : "lux"}
          </div>
        );
      },
    },
    {
      title: "Cập nhật ngưỡng",
      align: "center",
      width: "35%",
      render: (_, threshold) => {
        switch (threshold.name) {
          case ThresholdNameEnum.HUMISENSOR: {
            const low = JSON.parse(threshold.lowThreshold.toString())[0];
            const hight = JSON.parse(threshold.highThreshold.toString())[0];
            return (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="threshold-children">
                  <span>0</span>
                  <div style={{ margin: 4, width: 200 }}>
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
                  onClick={() =>
                    updateThresholdAPi(ThresholdNameEnum.HUMISENSOR)
                  }
                >
                  Cập nhật
                </button>
              </div>
            );
          }
          case ThresholdNameEnum.LIGHTSENSOR: {
            const low = JSON.parse(threshold.lowThreshold.toString())[0];
            const hight = JSON.parse(threshold.highThreshold.toString())[0];
            return (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="threshold-children">
                  <span>0</span>
                  <div style={{ margin: 4, width: 200 }}>
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
                  onClick={() =>
                    updateThresholdAPi(ThresholdNameEnum.LIGHTSENSOR)
                  }
                >
                  Cập nhật
                </button>
              </div>
            );
          }
          case ThresholdNameEnum.TEMPAIRSENSOR: {
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
                    <div style={{ margin: 4, width: 200 }}>
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
                    <div style={{ margin: 4, width: 200 }}>
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
                    updateThresholdAPi(ThresholdNameEnum.TEMPAIRSENSOR)
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
