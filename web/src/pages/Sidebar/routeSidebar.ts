export interface MenuItem {
  titleSidebar: string;
  key?: React.Key;
  url: string;
  children?: MenuItem[];
}

export const listSidebarInit: MenuItem[] = [
  {
    titleSidebar: "Trang chủ",
    key: "home",
    url: "home",
  },
  {
    titleSidebar: "Quản lý khu vườn",
    key: "garden",
    url: "garden",
  },
  {
    titleSidebar: "Quản lý nhân viên",
    key: "management-worker",
    url: "management-worker",
  },
  {
    titleSidebar: "Quản lý thiết bị",
    key: "management-devices",
    url: "management-devices",
  },
  {
    titleSidebar: "Quản lý tài khoản",
    key: "account",
    url: "account",
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
