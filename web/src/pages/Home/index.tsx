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
} from "recharts";
import "./home.css";
import GardenApi from "../../api/garden";
import dayjs from "dayjs";
import { start } from "repl";

export default function Home() {
  const context = useContext(AuthContext);
  const [dataStatistical, setDataStatistical] = useState([]);

  useEffect(() => {
    if (context?.authInformation?.isAuthenticated) {
      const asyncApiFunction = async () => {
        const gardenApi = GardenApi.registerAuthApi();
        const res = await gardenApi.getDataStatisticalByDate();
        console.log(res);
        if (res.success) {
          setDataStatistical(res.data);
        }
      };
      asyncApiFunction();
    }
  }, [context?.authInformation?.isAuthenticated]);

  return (
    <div className="home">
      {context?.authInformation?.isAuthenticated ? (
        dataStatistical &&
        dataStatistical.map((data: any) => {
          return (
            <div key={data.id}>
              <div>Khu vườn: {data.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <LineChart
                  width={1050}
                  height={300}
                  // data={dataTest}
                  margin={{ top: 30, right: 20, bottom: 5, left: 0 }}
                >
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
                  <YAxis domain={[0, 100]} />
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

                  {/* bảng chú thich */}
                  <Legend
                    width={150}
                    wrapperStyle={{
                      top: 22,
                      right: -150,
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #d5d5d5",
                      borderRadius: 3,
                      fontSize: "15px",
                      textAlign: "start",
                      padding: 7,
                    }}
                    align="left"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Ánh sáng"
                    data={data.dataStatistical.lightDatas.map((item: any) => {
                      const hours =
                        dayjs(item.createdAt).hour() +
                        dayjs(item.createdAt).hour() / 60;
                      return {
                        ...item,
                        value: item.value.toFixed(2),
                        createdAt: hours.toFixed(2),
                      };
                    })}
                    yAxisId="right"
                    stroke="#FF0000"
                    orientation="right"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Độ ẩm đất"
                    data={data.dataStatistical.humiDatas.map((item: any) => {
                      const hours =
                        dayjs(item.createdAt).hour() +
                        dayjs(item.createdAt).hour() / 60;
                      return {
                        ...item,
                        value: item.value.toFixed(2),
                        createdAt: hours.toFixed(2),
                      };
                    })}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="Nhiệt độ"
                    data={data.dataStatistical.tempAirDatas.map((item: any) => {
                      const hours =
                        dayjs(item.createdAt).hour() +
                        dayjs(item.createdAt).hour() / 60;
                      return {
                        ...item,
                        temp: item.temp.toFixed(2),
                        createdAt: hours.toFixed(2),
                      };
                    })}
                    stroke="#8884d8"
                    dot={false}
                    // className="test_non"
                  />
                  <Line
                    // className="test_non"
                    type="monotone"
                    dataKey="airHumidity"
                    name="Độ ẩm không khí"
                    data={data.dataStatistical.tempAirDatas.map((item: any) => {
                      const hours =
                        dayjs(item.createdAt).hour() +
                        dayjs(item.createdAt).hour() / 60;
                      return {
                        ...item,
                        airHumidity: item.airHumidity.toFixed(2),
                        createdAt: hours.toFixed(2),
                      };
                    })}
                    stroke="#82ca9d"
                    dot={false}
                  />
                </LineChart>
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
