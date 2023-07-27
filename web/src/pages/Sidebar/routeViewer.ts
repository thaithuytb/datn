export interface MenuItem {
    titleSidebar: string;
    key?: React.Key;
    url: string;
    children?: MenuItem[];
  }
  
  export const routesViewer: MenuItem[] = [
    {
      titleSidebar: "Trang chủ",
      key: "home",
      url: "home",
    },
    {
      titleSidebar: "Xem khu vườn",
      key: "garden",
      url: "garden",
    },
    {
      titleSidebar: "Chỉ dẫn đường đi",
      key: "road-map",
      url: "road-map",
    },
    {
      titleSidebar: "Đăng xuất",
      key: "logout",
      url: "#",
    },
  ];
  