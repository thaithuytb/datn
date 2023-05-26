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
    children: [],
    // children: [
    //   {
    //     titleSidebar: "Khu vườn Thái Bình",
    //     key: "2",
    //     url: "garden/2",
    //   },
    //   {
    //     titleSidebar: "Khu vườn Hà Nội",
    //     key: "3",
    //     url: "garden/3",
    //   },
    // ],
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
    titleSidebar: "Đăng xuất",
    key: "logout",
    url: "logout",
  },
];
