import { useContext } from "react";
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
  BarChart,
  Bar,
} from "recharts";

const data = [
  { cot: "cot 1", "Nhiệt độ(C)": "45", "Độ ẩm(%)": 90 },
  { cot: "cot 2", "Nhiệt độ(C)": "40", "Độ ẩm(%)": 88 },
  { cot: "cot 3", "Nhiệt độ(C)": "38", "Độ ẩm(%)": 89 },
  { cot: "cot 4", "Nhiệt độ(C)": "42", "Độ ẩm(%)": 60 },
  { cot: "cot 5", "Nhiệt độ(C)": "40", "Độ ẩm(%)": 65 },
];
export default function Home() {
  const context = useContext(AuthContext);
  return context?.authInformation?.isAuthenticated ? (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        {/* <XAxis dataKey="cot" /> */}
        <YAxis domain={[0, 100]} />

        {/* hover vào từng cột */}
        <Tooltip />

        {/* ô kẻ trong đồ thị */}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

        {/* bảng chú thich */}
        <Legend
          width={150}
          wrapperStyle={{
            bottom: 0,
            left: "40%",
            backgroundColor: "#f5f5f5",
            border: "1px solid #d5d5d5",
            borderRadius: 3,
            fontSize: "15px",
          }}
        />
        <Line type="monotone" dataKey="Nhiệt độ(C)" stroke="#8884d8" />
        <Line type="monotone" dataKey="Độ ẩm(%)" stroke="#82ca9d" />
      </LineChart>

      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="cot" stroke="#8884d8" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend
          width={150}
          wrapperStyle={{
            bottom: 0,
            left: "40%",
            backgroundColor: "#f5f5f5",
            border: "1px solid #d5d5d5",
            borderRadius: 3,
            lineHeight: "40px",
          }}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="Nhiệt độ(C)" fill="#8884d8" barSize={30} />
        <Bar dataKey="Độ ẩm(%)" fill="#82ca9d" barSize={30} />
      </BarChart>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
