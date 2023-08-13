import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import NotificationApi from "../api/notification";
import { AuthContext } from "./AuthContext";

interface PropsNotificationContext {
  children: ReactNode;
}

interface INotificationContext {
  notifications: any;
  setNotifilcations: (notifications: any) => void;
  count: number;
  setCount: any;
}

export interface INotification {
  notification: {
    id: number;
    description: string;
    title: string;
    date: string;
    gardenId: number;
    type: string;
    createdAt:string
  };
  createdBy: {
    fullName: string;
  };
  notificationStatus: {
    seen: boolean;
  };
}

export const NotificationContext = createContext<
  INotificationContext | undefined
>(undefined);

export const NotificationProvider: React.FC<PropsNotificationContext> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [count, setCount] = useState<number>(0);
  const notificationApi = new NotificationApi();
  const authContext = useContext(AuthContext)

  useEffect(() => {
    (async () => {
      const res = await notificationApi.countNotifications();
      if (res) {
        setCount(res.data.count);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext?.authInformation.isAuthenticated]);

  const data = {
    notifications,
    setNotifilcations: setNotifications,
    count,
    setCount,
  };
  return (
    <NotificationContext.Provider value={data}>
      {children}
    </NotificationContext.Provider>
  );
};
