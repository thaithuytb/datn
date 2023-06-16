import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
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
import StatusDevices from "./pages/StatusDevices";
import ListDevice from "./pages/ListDevice";
import DeviceContextProvider from "./contexts/DeviceContext";
import CreateAccount from "./pages/CreateAccount";
import ManagementWorker from "./pages/ManagementWorker";
import ProtectedMain from "./routes/protectedMain";

const App = () => {
  const location = useLocation();
  const url = location.pathname;
  return (
    <AuthContextProvider>
      <MessageContextProvider>
        <GardenContextProvider>
          <DeviceContextProvider>
            {url !== "/login" && <HeaderLayout />}
            <div className={url !== "/login" ? "app_content" : ""}>
              <div className="">{url !== "/login" && <SidebarLayout />}</div>
              <div className="content">
                <Routes>
                  <Route path="/login" element={<Login />} />

                  <Route element={<ProtectedMain />}>
                    <Route path="/home" element={<Home />} />
                    <Route>
                      <Route path="/garden/:gardenId" element={<Garden />} />
                      <Route
                        path="/garden/:gardenId/status"
                        element={<StatusDevices />}
                      />
                    </Route>
                    <Route>
                      <Route path="/garden/:gardenId" element={<Garden />} />
                      <Route
                        path="/garden/:gardenId/status"
                        element={<StatusDevices />}
                      />
                    </Route>
                    <Route
                      path="/management-worker"
                      element={<ManagementWorker />}
                    />
                    <Route>
                      <Route
                        path="/list-device/:gardenId"
                        element={<ListDevice />}
                      />
                      <Route path="/list-device" element={<ListDevice />} />
                    </Route>
                    <Route>
                      <Route
                        path="/status-devices/:gardenId"
                        element={
                          <ProtectedRoute componentRedirect={StatusDevices} />
                        }
                      />
                      <Route
                        path="/status-devices"
                        element={
                          <ProtectedRoute componentRedirect={StatusDevices} />
                        }
                      />
                    </Route>
                    <Route
                      path="/personal-information"
                      element={
                        <ProtectedRoute
                          componentRedirect={PersonalInformation}
                        />
                      }
                    />
                    <Route
                      path="/change-password"
                      element={
                        <ProtectedRoute componentRedirect={ChangePassword} />
                      }
                    />
                    <Route
                      path="/create-account"
                      element={
                        <ProtectedRoute componentRedirect={CreateAccount} />
                      }
                    />
                    <Route
                      path="/logout"
                      element={<ProtectedRoute componentRedirect={Logout} />}
                    />
                    <Route path="/*" element={<NotFound />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </DeviceContextProvider>
        </GardenContextProvider>
      </MessageContextProvider>
    </AuthContextProvider>
  );
};

export default App;
