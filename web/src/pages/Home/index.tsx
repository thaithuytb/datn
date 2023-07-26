import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./index.css";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import DataStatisticalApi from "../../api/data-statistical";

export default function Home() {
  const dataStatisticalApi = new DataStatisticalApi();
  const context = useContext(AuthContext);
  const [dataStatistical, setDataStatistical] = useState([]);
  const dateFormat = "YYYY-MM-DD";
  const currentDate = dayjs();

  useEffect(() => {
    if (context?.authInformation?.isAuthenticated) {
      const asyncApiFunction = async () => {
        const res = await dataStatisticalApi.getDataStatisticalByDate({
          time: dayjs().format("YYYY-MM-DD"),
        });
        if (res.success) {
          setDataStatistical(res.data);
        }
      };
      asyncApiFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.authInformation?.isAuthenticated]);

  const changeDate = async (date: any, dateString: string) => {
    // data-statistical
    const dataStatisticalApi = new DataStatisticalApi();
    try {
      const dto = {
        time: dateString,
      };
      const res = await dataStatisticalApi.getDataStatisticalByDate(dto);
      if (res.success) {
        setDataStatistical(res.data);
      }
    } catch (error) {}
  };

  return (
    <div className="home">
      <div style={{ marginBottom: "1rem" }}>
        <DatePicker
          defaultValue={dayjs(currentDate, dateFormat)}
          format={dateFormat}
          onChange={changeDate}
          inputReadOnly={true}
        />
      </div>
      {context?.authInformation?.isAuthenticated ? (
        dataStatistical &&
        dataStatistical.map((data: any) => {
          if (data.id !== 1) {
            return null;
          }
          return (
            <div key={data.id} style={{ width: "100%" }}>
              <div style={{ width: "100%" }}>Khu vườn: {data.name}</div>
              <div style={{ width: "100%" }} id="chart">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart margin={{ top: 30, bottom: 5 }}>
                    {/* bảng chú thich */}

                    <Legend
                      width={150}
                      wrapperStyle={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #d5d5d5",
                        borderRadius: 3,
                        fontSize: "15px",
                        textAlign: "start",
                        height: 70,
                        padding: 7,
                      }}
                      align="left"
                    />
                    <XAxis
                      dataKey="createdAt"
                      name="createdAt"
                      type="number"
                      allowDecimals={false}
                      tickCount={14}
                      domain={[0, 24]}
                      tickFormatter={(value) => {
                        return `${value}:00 h`;
                      }}
                    />
                    <YAxis domain={[0, 100]} width={40} />
                    <YAxis
                      domain={[0, 5000]}
                      yAxisId="right"
                      orientation="right"
                    />

                    {/* hover vào từng cột */}
                    <Tooltip
                      labelFormatter={(value) => {
                        const hour = Math.floor(parseFloat(value));
                        const minute = Math.round(
                          (parseFloat(value) - hour) * 60
                        );
                        return `Thời gian: ${dayjs()
                          .hour(hour)
                          .minute(minute)
                          .format("h[h]mm[m]")}`;
                      }}
                    />

                    {/* ô kẻ trong đồ thị */}
                    <CartesianGrid stroke="#ccc" strokeDasharray="1 2" />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Ánh sáng"
                      data={data.dataStatistical.lightLuxData.map(
                        (item: any) => {
                          const hours =
                            dayjs(item.createdAt).hour() +
                            dayjs(item.createdAt).hour() / 60;
                          return {
                            ...item,
                            value: item.value.toFixed(2),
                            createdAt: hours.toFixed(2),
                          };
                        }
                      )}
                      yAxisId="right"
                      stroke="#FF0000"
                      orientation="right"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Độ ẩm đất"
                      data={data.dataStatistical.humidityData.map(
                        (item: any) => {
                          const hours =
                            dayjs(item.createdAt).hour() +
                            dayjs(item.createdAt).hour() / 60;
                          return {
                            ...item,
                            value: item.value.toFixed(2),
                            createdAt: hours.toFixed(2),
                          };
                        }
                      )}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      name="Nhiệt độ"
                      data={data.dataStatistical.temperatureHumidityAirData.map(
                        (item: any) => {
                          const hours =
                            dayjs(item.createdAt).hour() +
                            dayjs(item.createdAt).hour() / 60;
                          return {
                            ...item,
                            temp: item.temperature.toFixed(2),
                            createdAt: hours.toFixed(2),
                          };
                        }
                      )}
                      stroke="#8884d8"
                      dot={false}
                      // className="test_non"
                    />
                    <Line
                      // className="test_non"
                      type="monotone"
                      dataKey="airHumidity"
                      name="Độ ẩm không khí"
                      data={data.dataStatistical.temperatureHumidityAirData.map(
                        (item: any) => {
                          const hours =
                            dayjs(item.createdAt).hour() +
                            dayjs(item.createdAt).hour() / 60;
                          return {
                            ...item,
                            airHumidity: item.humidityAir.toFixed(2),
                            createdAt: hours.toFixed(2),
                          };
                        }
                      )}
                      stroke="#82ca9d"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
}
