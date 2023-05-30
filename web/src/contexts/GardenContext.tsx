import { createContext, ReactNode, useState } from "react";
import GardenApi from "../api/garden";

interface PropsGardenContext {
  children: ReactNode;
}

interface IGardenContext {
  gardens: any[];
  gardenDetail: any;
  setGardens: any;
  // gardenDetailId: string;
  getGardens: () => void;
  getGardenById: (id: string) => void;
}

export const GardenContext = createContext<IGardenContext | undefined>(
  undefined
);

const GardenContextProvider: React.FC<PropsGardenContext> = ({ children }) => {
  const [gardens, setGardens] = useState([]);
  const [gardenDetail, setGardenDetail] = useState(null);

  const getGardens = async () => {
    const gardenApi = GardenApi.registerAuthApi();
    try {
      const res = await gardenApi.getGardens();
      if (res.success) {
        setGardens(res.data);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const getGardenById = async (id: string) => {
    const gardenApi = GardenApi.registerAuthApi();
    try {
      const res = await gardenApi.getGardenById({ id });
      if (res.success) {
        setGardenDetail(res.data);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const data = {
    gardens,
    gardenDetail,
    getGardens,
    getGardenById,
    setGardens,
  };

  return (
    <GardenContext.Provider value={data}>{children}</GardenContext.Provider>
  );
};

export default GardenContextProvider;
