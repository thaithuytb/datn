import { createContext, ReactNode, useContext, useState } from "react";
import DeviceApi from "../api/device";
import { MessageContext } from "./MessageContext";
import ThresholdApi from "../api/threshold";
import { IThreshold } from "../types/threshold";

interface IValueDevice {
  createdAt: string
  deviceId: number
  gardenId: number
  id: number
  status: boolean
  updatedAt: string
  value: number | null
}

export interface IDevice {
  createdAt: string
  gardenId: number
  id: number
  ip: string
  isDeleted: boolean
  status: boolean
  type: string
  updatedAt: string
  valueDevice: IValueDevice
}

interface PropsDeviceContext {
  children: ReactNode;
}

interface IDeviceContext {
  devices: any[];
  getDevicesByGardenId: (gardenId: string) => void;
  setDevices: any;
  getThresholdsByGardenId: (gardenId: number) => void;
  thresholds: IThreshold[];
  setThresholds: any;
}

export const DeviceContext = createContext<IDeviceContext | undefined>(
  undefined
);

const DeviceContextProvider: React.FC<PropsDeviceContext> = ({ children }) => {
  const messageContext = useContext(MessageContext);
  const [devices, setDevices] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const getDevicesByGardenId = async (gardenId: string) => {
    const deviceApi = DeviceApi.registerDeviceApi();
    try {
      const res = await deviceApi.getDevicesByGardenId({ gardenId });
      if (res.success) {
        setDevices(res.data);
      }
    } catch (error: any) {
      setDevices([]);
      messageContext?.error(error?.message);
    }
  };

  const getThresholdsByGardenId = async (gardenId: number) => {
    const thresholdApi = ThresholdApi.registerThresholdApi();
    try {
      const res = await thresholdApi.getThreshold({ gardenId });
      if (res.success) {
        setThresholds(res.data.thresholds);
      }
    } catch (error: any) {
      setThresholds([]);
      messageContext?.error(error?.message);
    }
  };

  const data = {
    devices,
    getDevicesByGardenId,
    setDevices,
    getThresholdsByGardenId,
    thresholds,
    setThresholds,
  };

  return (
    <DeviceContext.Provider value={data}>{children}</DeviceContext.Provider>
  );
};

export default DeviceContextProvider;
