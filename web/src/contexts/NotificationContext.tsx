import React, { ReactNode, createContext, useEffect, useState } from "react";
import NotificationApi from "../api/notification";

interface PropsNotificationContext {
  children: ReactNode;
}

interface INotificationContext {
  notifications: any
  setNotifilcations: (notifications: any) => void
  count: number
  setCount: any
}

export interface INotification {
  notification: {
    id: number
    description: string
    title: string
    date: string
    gardenId: number
    type: string
  },
  createdBy: {
    fullName: string
  },
  notificationStatus: {
    seen: boolean
  }
}

export const NotificationContext = createContext<INotificationContext | undefined>(
  undefined
);

export const NotificationProvider: React.FC<PropsNotificationContext> = ({ children }) => {

  const [notifications, setNotifilcations] = useState<INotification[]>([]);
  const [count, setCount] = useState<number>(0)
  const notificationApi = new NotificationApi();

  useEffect(() => {
    (async () => {
      const res = await notificationApi.countNotifile()
      if (res) {
        setCount(res.data.count)
      }
    })()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const data = {
    notifications,
    setNotifilcations,
    count,
    setCount,
  }
  return (
    <NotificationContext.Provider value={data}>
      {children}
    </NotificationContext.Provider>
  );
};
