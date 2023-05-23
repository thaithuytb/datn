import { Button, Slider, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// const ControlSwitch = () => {
//     const Checked = (checked: any) => {
//         console.log(checked)
//     }
//     return <Switch defaultChecked onChange={Checked} />
// }
// const ControlSlider = () => {
//     const [size, setSize] = useState(1);
//     console.log(size)
//     return <Slider value={size} onChange={(value) => setSize(value)} max={4} />
// }

interface MyDataType {
  stt: number;
  id: string;
  name: string;
  status: string;
  control: any;
}

// const dataTable = {
//     columns: [
//         {
//             title: 'STT',
//             dataIndex: 'stt',
//             key: 'stt',
//             align: 'center',
//         },
//         {
//             title: 'Tên thiết bị',
//             dataIndex: 'name',
//             key: 'name',
//             align: 'center',
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'status',
//             key: 'status',
//             align: 'center',
//         },
//         {
//             title: 'Điều khiển',
//             dataIndex: 'control',
//             key: 'control',
//             align: 'center',
//             width: 150,
//         },
//     ] as ColumnsType<MyDataType>,
//     data: [
//         {
//             stt: 1,
//             id: '1',
//             name: 'thiết bị 1',
//             status: 'Đang sử dụng',
//             control: <ControlSwitch />
//         },
//         {
//             stt: 2,
//             id: '2',
//             name: 'thiết bị 2',
//             status: 'Đang sử dụng',
//             control: <ControlSlider />
//         },
//     ] as MyDataType[],
// };

const TableComponent = (props: any) => {
  const { click, text, dataTable } = props;
  // const click = true;
  // const text = 'Chi tiết';
  const navigate = useNavigate();
  const dataSource = [...dataTable.data];

  const handleNavigate = (id: string) => {
    navigate(`${id}`);
  };

  let defaultColumns: ColumnsType<MyDataType>;

  if (click) {
    defaultColumns = [
      ...dataTable.columns,
      {
        title: "",
        dataIndex: "",
        render: (record: MyDataType) =>
          dataSource.length > 0 ? (
            <Button
              style={{
                backgroundColor: "#25c8f1",
                color: "white",
                padding: "0px 8px",
              }}
              onClick={() => handleNavigate(record.id)}
            >
              {text}
            </Button>
          ) : null,
        width: 50,
      },
    ];
  } else {
    defaultColumns = dataTable.columns;
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={defaultColumns} />
    </div>
  );
};

export default TableComponent;
