import { createContext, ReactNode, useEffect, useState } from "react";
import GardenApi from "../api/garden";

interface PropsGardenContext {
  children: ReactNode;
}

const gardenInformationDefault: IGardenInformation = {
  gardens: null,
};

interface IGardenInformation {
  gardens: null | any; //TODO: Garden | null
}

interface IGardenContext {
  gardenInformation: IGardenInformation;
  getGardens: () => void;
}

export const GardenContext = createContext<IGardenContext | undefined>(
  undefined
);

const GardenContextProvider: React.FC<PropsGardenContext> = ({ children }) => {
  const [gardenInformation, setGardenInformation] =
    useState<IGardenInformation>(gardenInformationDefault);

  const getGardens = async () => {
    const gardenApi = GardenApi.registerAuthApi();
    try {
      const res = await gardenApi.getGardens();
      if (res.success) {
        setGardenInformation({
          ...gardenInformation,
          gardens: res.data,
        });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const data = {
    gardenInformation,
    getGardens,
  };

  useEffect(() => {
    getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GardenContext.Provider value={data}>{children}</GardenContext.Provider>
  );
};

export default GardenContextProvider;
