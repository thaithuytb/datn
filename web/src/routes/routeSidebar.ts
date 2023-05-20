export interface MenuItem {
  titleSidebar: string;
  key?: React.Key;
  url: string;
  children?: MenuItem[];
}
export const listSidebar: MenuItem[] = [
  {
    titleSidebar: "Quản lý vườn",
    key: "1",
    url: "garden",
    children: [
      {
        titleSidebar: "Khu vườn Thái Bình",
        key: "2",
        url: "garden/2",
      },
      {
        titleSidebar: "Khu vườn Hà Nội",
        key: "3",
        url: "garden/3",
      },
    ],
  },
  {
    titleSidebar: "Quản lý nhân viên",
    key: "4",
    url: "management-worker",
  },
  {
    titleSidebar: "Quản lý thiết bị",
    key: "5",
    url: "management-device",
  },
  {
    titleSidebar: "Thông tin cá nhân",
    key: "6",
    url: "personal-information",
  },
  {
    titleSidebar: "Đổi mật khẩu",
    key: "7",
    url: "change-password",
  },
  {
    titleSidebar: "Đăng xuất",
    key: "8",
    url: "logout",
  },
];
