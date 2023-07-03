import "./App.css";
import { Route, Routes } from "react-router-dom";
import HeaderLayout from "./pages/Header";
import SidebarLayout from "./pages/Sidebar";
import Garden from "./pages/Garden";
import Logout from "./components/Logout";
import ChangePassword from "./pages/ChangePassword";
import PersonalInformation from "./pages/PersonalInformation";
import ProtectedRoute from "./routes/protectedRoute";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AuthContextProvider from "./contexts/AuthContext";
import MessageContextProvider from "./contexts/MessageContext";
import GardenContextProvider from "./contexts/GardenContext";
import StatusGardens from "./pages/StatusGarden";
import ListDevice from "./pages/ListDevice";
import DeviceContextProvider from "./contexts/DeviceContext";
import CreateAccount from "./pages/Account/Create";
import ManagementWorker from "./pages/ManagementWorker";
import ProtectedMain from "./routes/protectedMain";
import Account from "./pages/Account";
import UpdateAccount from "./pages/Account/Update";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";

const RouteMain = () => {
  return (
    <>
      <HeaderLayout />
      <div className="app_content">
        <div className="SidebarLayout">
          <SidebarLayout />
        </div>
        <div className="content">
          <Routes>
            <Route element={<ProtectedMain />}>
              <Route path="/home" element={<Home />} />
              <Route>
                <Route path="/garden/:gardenId" element={<Garden />} />
                <Route path="/garden" element={<Garden />} />
                <Route
                  path="/garden/:gardenId/status"
                  element={<StatusGardens />}
                />
              </Route>
              <Route>
                <Route
                  path="/management-worker"
                  element={<ManagementWorker />}
                />
                <Route
                  path="/management-worker/:gardenId"
                  element={<ManagementWorker />}
                />
              </Route>
              <Route>
                <Route path="/management-devices" element={<ListDevice />} />
                <Route
                  path="/management-devices/:gardenId"
                  element={<ListDevice />}
                />
              </Route>
              <Route>
                <Route
                  path="/status-gardens/:gardenId"
                  element={<ProtectedRoute componentRedirect={StatusGardens} />}
                />
                <Route
                  path="/status-gardens"
                  element={<ProtectedRoute componentRedirect={StatusGardens} />}
                />
              </Route>
              <Route
                path="/personal-information"
                element={
                  <ProtectedRoute componentRedirect={PersonalInformation} />
                }
              />
              <Route
                path="/change-password"
                element={<ProtectedRoute componentRedirect={ChangePassword} />}
              />
              <Route>
                <Route path="/account" element={<Account />} />
                <Route
                  path="/account/create-account"
                  element={<CreateAccount />}
                />
                <Route
                  path="/account/update-account"
                  element={<UpdateAccount />}
                />
              </Route>
              <Route
                path="/logout"
                element={<ProtectedRoute componentRedirect={Logout} />}
              />
              <Route path="/*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <SocketProvider>
        <AuthContextProvider>
          <MessageContextProvider>
            <GardenContextProvider>
              <DeviceContextProvider>
                <div className="app">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={<RouteMain />} />
                  </Routes>
                </div>
              </DeviceContextProvider>
            </GardenContextProvider>
          </MessageContextProvider>
        </AuthContextProvider>
      </SocketProvider>
    </NotificationProvider>
  );
};

export default App;
