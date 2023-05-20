import { useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import gardenApi from "../../api/garden";
import { Garden } from "../../types/garden.type";
import { Menu } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import { Link } from "react-router-dom";
import { MenuItem, listSidebar } from "../../routes/routeSidebar";

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

export default function SidebarLayout() {
  return (
    <Menu
      style={{ width: 256 }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme={"light"}
    >
      {listSidebar.map((item: MenuItem) =>
        item.children ? (
          <SubMenu key={item.key} title={item.titleSidebar}>
            {item.children.map((childItem: MenuItem) => (
              <Menu.Item key={childItem.key}>
                <Link to={`/${childItem.url}`}>{childItem.titleSidebar}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item key={item.key}>
            <Link to={`/${item.url}`}>{item.titleSidebar}</Link>
          </Menu.Item>
        )
      )}
    </Menu>
  );
}
