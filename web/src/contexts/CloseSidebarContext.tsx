import { createContext, ReactNode, useState } from "react";

interface PropsCloseSidebarContext {
    children: ReactNode;
}

interface ICloseSidebarContext {
    isOpenHeader: boolean;
    setOpenHeader: any
}

export const CloseSidebarContextContext = createContext<ICloseSidebarContext | undefined>(
    undefined
);

const CloseSidebarContextProvider: React.FC<PropsCloseSidebarContext> = ({ children }) => {
    const [isOpenHeader, setOpenHeader] = useState<boolean>(false);

    const data = {
        isOpenHeader,
        setOpenHeader
    };

    return (
        <CloseSidebarContextContext.Provider value={data}>{children}</CloseSidebarContextContext.Provider>
    );
};
export default CloseSidebarContextProvider;
