import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import HeaderLayout from "./pages/Header";
import SidebarLayout from "./pages/Sidebar";
import Garden from "./pages/Garden";
import Logout from "./components/Logout";
import ChangePassword from "./pages/ChangePassword";
import PersonalInformation from "./pages/PersonalInformation";
import ProtectedRoute from "./routes/protectedRoute";
import AdminRoute from "./routes/adminRoute";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AuthContextProvider from "./contexts/AuthContext";
import MessageContextProvider from "./contexts/MessageContext";
import GardenContextProvider from "./contexts/GardenContext";
import StatusDevices from "./pages/StatusDevices";
import ListDevice from "./pages/ListDevice";

const App = () => {
  const location = useLocation();
  const url = location.pathname;

  return (
    <AuthContextProvider>
      <MessageContextProvider>
        <GardenContextProvider>
          {url !== "/login" && <HeaderLayout />}
          <div className={url !== "/login" ? "app_content" : ""}>
            <div className="">{url !== "/login" && <SidebarLayout />}</div>
            <div className="content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/home"
                  element={<ProtectedRoute componentRedirect={Home} />}
                />
                <Route>
                  <Route
                    path="/garden/:gardenId"
                    element={<ProtectedRoute componentRedirect={Garden} />}
                  />
                  <Route
                    path="/garden/:gardenId/status"
                    element={
                      <ProtectedRoute componentRedirect={StatusDevices} />
                    }
                  />
                </Route>
                <Route>
                  <Route
                    path="/garden/:gardenId"
                    element={<ProtectedRoute componentRedirect={Garden} />}
                  />
                  <Route
                    path="/garden/:gardenId/status"
                    element={
                      <ProtectedRoute componentRedirect={StatusDevices} />
                    }
                  />
                </Route>
                <Route
                  path="/management-worker"
                  element={<AdminRoute componentRedirect={NotFound} />}
                />
                <Route>
                  <Route
                    path="/list-device/:gardenId"
                    element={<ProtectedRoute componentRedirect={ListDevice} />}
                  />
                  <Route
                    path="/list-device"
                    element={<ProtectedRoute componentRedirect={ListDevice} />}
                  />
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
                    <ProtectedRoute componentRedirect={PersonalInformation} />
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute componentRedirect={ChangePassword} />
                  }
                />
                <Route
                  path="/logout"
                  element={<ProtectedRoute componentRedirect={Logout} />}
                />
                <Route path="/*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </GardenContextProvider>
      </MessageContextProvider>
    </AuthContextProvider>
  );
};

export default App;
