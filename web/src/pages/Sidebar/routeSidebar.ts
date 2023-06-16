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
    key: "management-device",
    url: "management-device",
    children: [
      {
        titleSidebar: "Danh sách thiết bị",
        url: "list-device",
        key: "list-device",
      },
      {
        titleSidebar: "Trạng thái thiết bị",
        url: "status-devices",
        key: "status-devices",
      },
    ],
  },
  {
    titleSidebar: "Thông tin cá nhân",
    key: "personal-information",
    url: "personal-information",
  },
  {
    titleSidebar: "Đổi mật khẩu",
    key: "change-password",
    url: "change-password",
  },
  {
    titleSidebar: "Tao tai khoan",
    key: "create-account",
    url: "create-account",
  },
  {
    titleSidebar: "Đăng xuất",
    key: "logout",
    url: "logout",
  },
];
