import { useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Kết nối tới server socket
    const socket = socketIOClient("http://localhost:7000/fan"); 
    setSocket(socket)

    // Lắng nghe sự kiện "newFanStatus" từ server socket
    socket.on("newFanStatus", (data) => {
      console.log("Nhận dữ liệu từ server: ", data);
      // Cập nhật dữ liệu nhận được vào state
      setMessage(JSON.stringify(data));
    });

    // Ngắt kết nối socket khi component bị hủy
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    console.log('socket: ', socket)
    // Gửi dữ liệu lên server socket
    if (socket) {
      socket.emit("changeFanStatus", "test");
    }
  };

  return (
    <div>
      <h1>Test socket</h1>
      <button onClick={handleSendMessage}>Gửi tin nhắn</button>
      <p>Trạng thái hiện tại của quạt:: {message}</p>
    </div>
  );
};

export default App;




