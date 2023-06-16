import { useContext } from "react";
import { Menu, Modal } from "antd";
import { CloseOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MenuItem, listSidebarInit } from "./routeSidebar";
import { AuthContext } from "../../contexts/AuthContext";

const { confirm } = Modal;

export default function SidebarLayout() {
  const authContext = useContext(AuthContext);
  const items: any = listSidebarInit.map((item: MenuItem) => {
    return {
      key: item.key,
      label: item.titleSidebar,
      children:
        item.children &&
        item.children.map((childrenItem) => {
          return {
            key: childrenItem.key,
            label: childrenItem.titleSidebar,
          };
        }),
    };
  });

  const navigate = useNavigate();

  const logout = () => {
    showLogoutModal();
  };

  const showLogoutModal = () => {
    confirm({
      title: "Bạn có chắc muốn thoát đăng nhập  ",
      icon: <ExclamationCircleFilled />,
      okText: "Đăng xuất =((",
      closeIcon: <CloseOutlined />,
      cancelText: "Ở lại",
      onOk() {
        navigate("/login");
        authContext?.logout();
      },
      onCancel() {},
    });
  };

  const listItemSidebar = ({ key }: { key: string }) => {
    const itemActive: MenuItem[] = [];
    for (const item of listSidebarInit) {
      if (item.key === key) {
        itemActive.push(item);
      }
      if (item.children) {
        const itemChildren = item.children.find(
          (childrenItem: MenuItem) => childrenItem.key === key
        );
        if (itemChildren) {
          itemActive.push(itemChildren);
        }
      }
    }

    if (itemActive.length) {
      if (itemActive[0].url === "logout") {
        logout();
      } else {
        navigate(`${itemActive[0].url}`);
      }
    }
  };
  return (
    <Menu
      style={{ width: 256 }}
      mode="inline"
      theme={"light"}
      defaultSelectedKeys={["home"]}
      // defaultOpenKeys={["sub1"]}
      // defaultChecked={true}
      onClick={listItemSidebar}
      items={items}
    />
  );
}
