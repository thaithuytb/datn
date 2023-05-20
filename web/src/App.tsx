import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderLayout from "./pages/Header";
import SidebarLayout from "./pages/sidebar";
import Garden from "./pages/Garden";
import Logout from "./components/Logout";
import ChangePassword from "./pages/ChangePassword";
import PersonalInformation from "./pages/PersonalInformation";
import { ProtectedRoute } from "./routes/protectedRoute";
import { AdminRoute } from "./routes/adminRoute";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <HeaderLayout />
      <div className="app_content">
        <SidebarLayout />
        <Routes>
          <Route
            path="/garden/*"
            element={<ProtectedRoute componentRedirect={Garden} />}
          />
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
            element={<ProtectedRoute componentRedirect={PersonalInformation} />}
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
    </BrowserRouter>
  );
};

export default App;
