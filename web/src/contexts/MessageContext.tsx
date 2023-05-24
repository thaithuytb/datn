import { createContext, ReactNode } from "react";
import { message } from "antd";

interface PropsMessageContext {
  children: ReactNode;
}

interface IMessageContext {
  success: any;
  error: any;
  warning: any;
}

export const MessageContext = createContext<IMessageContext | undefined>(
  undefined
);

const MessageContextProvider: React.FC<PropsMessageContext> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: message || "success !!!",
      duration: 2,
    });
  };

  const error = (message?: string) => {
    messageApi.open({
      type: "error",
      content: message || "error !!!",
      duration: 4,
    });
  };

  const warning = (message?: string) => {
    messageApi.open({
      type: "warning",
      content: message || "warning !!!",
      duration: 3,
    });
  };
  const data = {
    success,
    warning,
    error,
  };

  return (
    <>
      {contextHolder}
      <MessageContext.Provider value={data}>{children}</MessageContext.Provider>
    </>
  );
};
export default MessageContextProvider;
