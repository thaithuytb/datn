import React, { useContext, useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import gardenApi from "../../api/garden";
import { Garden } from "../../types/garden.type";
import { Menu, Modal } from "antd";
import {
  CloseOutlined,
  ExclamationCircleFilled,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/es/menu/SubMenu";
import {
  Link,
  Navigate,
  NavigateFunction,
  useNavigate,
} from "react-router-dom";
import { MenuItem, listSidebar } from "../../routes/routeSidebar";
import { AuthContext } from "../../contexts/authContext";
const { confirm } = Modal;
// export default function SidebarLayout() {
// const [gardens, setGardens] = useState<Garden[] | []>([]);

// const getGardens = async () => {
//   const { getGardens } = gardenApi;
//   try {
//     const response = await getGardens();
//     console.log({ response });
//     if (response.data.success === true) {
//       setGardens(response.data.data);
//     }
//   } catch (error) {
//     console.log({ error });
//   }
// };
// const [socket, setSocket] = useState<Socket | null>(null);
// const [message, setMessage] = useState("");

// useEffect(() => {
//   // Kết nối tới server socket
//   const socket = socketIOClient("http://localhost:7000/fan");
//   setSocket(socket)

//   // Lắng nghe sự kiện "newFanStatus" từ server socket
//   socket.on("newFanStatus", (data) => {
//     console.log("Nhận dữ liệu từ server: ", data);
//     // Cập nhật dữ liệu nhận được vào state
//     setMessage(JSON.stringify(data));
//   });

//   // Ngắt kết nối socket khi component bị hủy
//   return () => {
//     socket.disconnect();
//   };
// }, []);

// const handleSendMessage = () => {
//   console.log('socket: ', socket)
//   // Gửi dữ liệu lên server socket
//   if (socket) {
//     socket.emit("changeFanStatus", "test");
//   }
// };
// useEffect(() => {
//   getGardens();
// }, []);

//   return (
//     <div>
//       <h3>Danh sách khu vườn</h3>
//       <ul>
//         {gardens?.length > 0 &&
//           gardens?.map((garden) => <li key={garden.id}>{garden.name}</li>)}
//       </ul>
//       <h3>Thông tin cá nhân</h3>
//       {/* <button onClick={handleSendMessage}>Gửi tin nhắn</button> */}
//       {/* <p>Trạng thái hiện tại của quạt:: {message}</p> */}
//     {/* </div> */}
//   );
// }

const items: any = listSidebar.map((item: MenuItem) => {
  return {
    key: item.key,
    label: item.titleSidebar,
    children:
      item.children &&
      item.children.map((childrenItem) => {
        return {
          key: childrenItem.key,
          label: childrenItem.titleSidebar,
        };
      }),
  };
});

export default function SidebarLayout() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const showLogoutModal = () => {
    confirm({
      title: "Bạn có chắc chắn rời đi và không gặp lại:((((",
      icon: <ExclamationCircleFilled />,
      okText: "Đăng xuất:((",
      closeIcon: <CloseOutlined />,
      cancelText: "Ở lại",
      onOk() {
        navigate("/login");
        context?.logout();
      },
      onCancel() {},
    });
  };

  const logout = () => {
    showLogoutModal();
  };

  const listItemSidebar = ({ key }: { key: string }) => {
    const itemActive: MenuItem[] = [];
    for (const item of listSidebar) {
      if (item.key === key) {
        itemActive.push(item);
      }
      if (item.children) {
        const itemChildren = item.children.find(
          (childrenItem: MenuItem) => childrenItem.key === key
        );
        if (itemChildren) {
          itemActive.push(itemChildren);
        }
      }
    }

    if (itemActive.length) {
      if (itemActive[0].url === "logout") {
        logout();
      } else {
        navigate(`${itemActive[0].url}`);
      }
    }
  };
  return (
    <Menu
      style={{ width: 256 }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme={"light"}
      onClick={listItemSidebar}
      items={items}
    />
  );
}
