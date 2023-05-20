import "./index.css";
import { Badge, Button, Dropdown, Space, theme } from "antd";
import { Link } from "react-router-dom";
import { BellFilled } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import type { MenuProps } from "antd";
import Avatar from "../../components/Avatar";

// function ItemNotification() {
//   return (
//     <>
//       <Link to="https://www.aliyun.com">thông báo</Link>
//       <Button type="primary">Click me!</Button>
//     </>
//   );
// }
// const items: MenuProps["items"] = [
//   {
//     label: ItemNotification(),
//     key: "0",
//   },
//   {
//     label: <a href="https://www.aliyun.com">2nd menu item</a>,
//     key: "1",
//   },
//   {
//     type: "divider",
//   },
//   {
//     label: "3rd menu item",
//     key: "3",
//   },
// ];

export default function HeaderLayout() {
  return (
    <Header className="header">
      <div className="header_left">
        <h2>Quản lý khu vườn</h2>
      </div>

      <div className="header_right">
        <div>
          <Space size="middle">
            <Badge count={0} showZero>
              <BellFilled style={{ fontSize: 20 }} />
            </Badge>
          </Space>
        </div>

        <div>
          <Space size="middle">
            <Avatar />
          </Space>
        </div>
      </div>
    </Header>
  );
}
