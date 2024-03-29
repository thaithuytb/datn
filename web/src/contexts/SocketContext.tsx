import React, { ReactNode, createContext, useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";

interface PropsSocketContext {
  children: ReactNode;
}

interface ISocketContext {
  socket: any;
}

export const SocketContext = createContext<ISocketContext | undefined>(
  undefined
);

export const SocketProvider: React.FC<PropsSocketContext> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (process.env.REACT_APP_SERVER_WEB_SOCKET) {
      const socket = socketIOClient(process.env.REACT_APP_SERVER_WEB_SOCKET);
      setSocket(socket);

      const gardenIds = [1];
      const payload = { gardenIds };
      socket.emit("joinGarden", payload);

      //note return
      return () => {
        socket.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
