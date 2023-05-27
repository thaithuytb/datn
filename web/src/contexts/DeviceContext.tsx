import { createContext, ReactNode, useContext, useState } from "react";
import DeviceApi from "../api/device";
import { MessageContext } from "./MessageContext";

interface PropsDeviceContext {
  children: ReactNode;
}

interface IDeviceContext {
  devices: any[];
  getDevicesByGardenId: (gardenId: string) => void;
  setDevices: any;
}

export const DeviceContext = createContext<IDeviceContext | undefined>(
  undefined
);

const DeviceContextProvider: React.FC<PropsDeviceContext> = ({ children }) => {
  const messageContext = useContext(MessageContext);
  const [devices, setDevices] = useState([]);

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

  const data = {
    devices,
    getDevicesByGardenId,
    setDevices,
  };

  return (
    <DeviceContext.Provider value={data}>{children}</DeviceContext.Provider>
  );
};

export default DeviceContextProvider;
