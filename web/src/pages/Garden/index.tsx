import { useParams } from "react-router-dom";
import TableComponent from "../../components/Table";
import { ColumnsType } from "antd/es/table";
import { Slider, Switch } from "antd";
import { useState } from "react";
interface MyDataType {
  stt: number;
  id: string;
  name: string;
  status: string;
  control: any;
}
const ControlSwitch = () => {
  const Checked = (checked: any) => {
    console.log(checked);
  };
  return <Switch defaultChecked onChange={Checked} />;
};
const ControlSlider = () => {
  const [size, setSize] = useState(1);
  return <Slider value={size} onChange={(value) => setSize(value)} max={4} />;
};
const dataTable = {
  columns: [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Tên thiết bị",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Điều khiển",
      dataIndex: "control",
      key: "control",
      align: "center",
      width: 150,
    },
  ] as ColumnsType<MyDataType>,
  data: [
    {
      stt: 1,
      id: "1",
      name: "thiết bị 1",
      status: "Đang sử dụng",
      control: <ControlSwitch />,
    },
    {
      stt: 2,
      id: "2",
      name: "thiết bị 2",
      status: "Đang sử dụng",
      control: <ControlSlider />,
    },
  ] as MyDataType[],
};
export default function Garden() {
  const { gardenId } = useParams();
  console.log(gardenId);
  return (
    <div className="Garden">
      {/* <header>
        <h2>Tên khu vườn</h2>
        <p>Diện tích</p>
        <p>Tổng quan</p>
      </header>
      <div className="GardenBody">
        <h3>Quản lý thiết bị</h3>
        <TableComponent click={true} text={"lịch sử"} dataTable={dataTable} />
      </div> */}
    </div>
  );
}
