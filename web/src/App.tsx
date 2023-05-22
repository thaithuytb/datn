import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import HeaderLayout from "./pages/Header";
import SidebarLayout from "./pages/Sidebar";
import Garden from "./pages/Garden";
import Logout from "./components/Logout";
import ChangePassword from "./pages/ChangePassword";
import PersonalInformation from "./pages/PersonalInformation";
import { ProtectedRoute } from "./routes/protectedRoute";
import { AdminRoute } from "./routes/adminRoute";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  const location = useLocation();
  const url = location.pathname;

  return (
    <div>
      {url !== '/login' && <HeaderLayout />} 
      <div className={url !== '/login' ? 'app_content': "" }>
        {url !== '/login' &&  <SidebarLayout />}  
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />}/>
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
    </div>
  );
};

export default App;
