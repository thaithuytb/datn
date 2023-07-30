import { createContext, ReactNode, useEffect, useState } from "react";
import { IInformationUserLogin } from "../types/login.type";
import AuthApi from "../api/auth";
import { LOCAL_STORAGE_TOKEN } from "../common/local-storage-token";
import { useNavigate } from "react-router-dom";

interface PropsAuthContext {
  children: ReactNode;
}

const authInformationDefault: IAuthInformation = {
  isAuthenticated: false,
  user: null,
  token: null,
};

interface IAuthInformation {
  isAuthenticated: boolean;
  user: any | null; //TODO: User | null,
  token: string | null;
}

interface IAuthContext {
  authInformation: IAuthInformation;
  login: (dto: IInformationUserLogin) => void;
  logout: () => void;
  setAuthInformation: any;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider: React.FC<PropsAuthContext> = ({ children }) => {
  const [authInformation, setAuthInformation] = useState<IAuthInformation>(
    authInformationDefault
  );

  const autoLogin = async () => {
    if (localStorage.getItem(LOCAL_STORAGE_TOKEN)) {
      const authApi = AuthApi.registerAuthApi();
      try {
        const res = await authApi.autoLogin();
        if (res.success) {
          const { user, token } = res.data;
          setAuthInformation({
            ...authInformation,
            user,
            token,
            isAuthenticated: true,
          });
        }
      } catch (error: any) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN);
      }
    }
  };

  const login = async (dto: IInformationUserLogin) => {
    const authApi = AuthApi.registerAuthApi();
    try {
      const res = await authApi.login(dto);
      if (res.success) {
        const { user, token } = res.data;
        localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
        setAuthInformation({
          ...authInformation,
          user,
          token,
          isAuthenticated: true,
        });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
    setAuthInformation({
      ...authInformation,
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  useEffect(() => {
    autoLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = {
    authInformation,
    login,
    logout,
    setAuthInformation,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
