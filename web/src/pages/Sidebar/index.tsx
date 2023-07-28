import React, { useContext, useEffect, useRef, useState } from "react";
import { Menu, Modal } from "antd";
import { CloseOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MenuItem, listSidebarInit, } from "./routeSidebar";
import { routesUser } from "./routeUser";
import { routesViewer } from "./routeViewer";
import { AuthContext } from "../../contexts/AuthContext";
import { Squash as Hamburger } from 'hamburger-react'
const { confirm } = Modal;

export default function SidebarLayout() {
  const close: any = useRef()
  const authContext = useContext(AuthContext);

  const list = authContext?.authInformation?.user?.role === "ADMIN" ? listSidebarInit :
  authContext?.authInformation?.user?.role === "USER" ? routesUser : routesViewer

  const [isOpenHeader, setOpenHeader] = useState<boolean>(false);
  const items: any = list.map((item: MenuItem) => {
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
        navigate("/");
        authContext?.logout();
      },
      onCancel() { },
    });
  };


  const listItemSidebar = ({ key }: { key: string }) => {
    if (window.innerWidth <= 500) {
      setOpenHeader(false);
    }
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

  ////////edit///////////////////
  const closeHeader = () => {
    if (window.innerWidth <= 500) {
      setOpenHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      closeHeader()
    });
    return () => {
      window.removeEventListener('resize', closeHeader);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // document.addEventListener('click', (event) => {
  //   const { target } = event
  //   if ((close.current?.children[1] !== target)) {
  //     closeHeader()
  //   }
  // })

  return (
    <div className="SidebarLayout" ref={close}>
      <div className="icon_close" style={{ transform: isOpenHeader ? 'translateX(256px)' : 'none' }}>
        <Hamburger size={27} toggled={isOpenHeader} toggle={setOpenHeader} />
      </div>
      <Menu
        id={`${isOpenHeader ? '' : 'SidebarLayout-transform'}`}
        mode="inline"
        defaultSelectedKeys={["home"]}
        onClick={listItemSidebar}
        items={items}
      />
    </div>
  );
}
