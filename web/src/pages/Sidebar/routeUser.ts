import { MenuItem } from "./routeSidebar";

export const routesUser: MenuItem[] = [
  {
    titleSidebar: "Trang chủ",
    key: "home",
    url: "home",
  },
  {
    titleSidebar: "Khu vườn tham gia",
    key: "garden",
    url: "garden",
  },
  {
    titleSidebar: "Quản lý chăm sóc khu vườn",
    key: "status-gardens",
    url: "status-gardens",
  },
  {
    titleSidebar: "Thông tin cá nhân",
    key: "personal-information",
    url: "personal-information",
  },
  {
    titleSidebar: "Chỉ dẫn đường đi",
    key: "road-map",
    url: "road-map",
  },
  {
    titleSidebar: "Đăng xuất",
    key: "logout",
    url: "logout",
  },
];
