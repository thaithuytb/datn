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
import MessageProvider from "./contexts/MessageContext";
import History from "./pages/Garden/History";

const App = () => {
  const location = useLocation();
  const url = location.pathname;

  return (
    <AuthContextProvider>
      <MessageProvider>
        {url !== "/login" && (
          <ProtectedRoute componentRedirect={HeaderLayout} />
        )}
        <div className={url !== "/login" ? "app_content" : ""}>
          <div className="app_contentSidebarLayout">
            {url !== "/login" && (
              <ProtectedRoute componentRedirect={SidebarLayout} />
            )}
          </div>
          <div className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route>
                <Route
                  path="/garden/:gardenId"
                  element={<ProtectedRoute componentRedirect={Garden} />}
                />
                <Route
                  path="/garden/:gardenId/:id"
                  element={<ProtectedRoute componentRedirect={History} />}
                />
              </Route>
              <Route
                path="/management-worker/*"
                element={<AdminRoute componentRedirect={NotFound} />}
              />
              <Route
                path="/management-device/*"
                element={<AdminRoute componentRedirect={NotFound} />}
              />
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
              <Route
                path="/logout"
                element={<ProtectedRoute componentRedirect={Logout} />}
              />
            </Routes>
          </div>
        </div>
      </MessageProvider>
    </AuthContextProvider>
  );
};

export default App;
