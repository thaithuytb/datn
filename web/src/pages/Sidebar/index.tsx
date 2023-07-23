import { useContext, useEffect, useState } from "react";
import { Menu, Modal } from "antd";
import { CloseOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MenuItem, listSidebarInit } from "./routeSidebar";
import { AuthContext } from "../../contexts/AuthContext";
import { Squash as Hamburger } from 'hamburger-react'
import { MessageContext } from "../../contexts/MessageContext";

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
      onCancel() { },
    });
  };


  const listItemSidebar = ({ key }: { key: string }) => {
    if(window.innerWidth <400){
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
  
  const {isOpenHeader, setOpenHeader} = useContext(MessageContext)!; 

  return (
    <div style={{height: '100%'}}>
      <div className="icon_close" style={{transform: isOpenHeader ? 'translateX(256px)' : 'none'}}>
        <Hamburger size={27} toggled={isOpenHeader} toggle={setOpenHeader}/>
      </div>
      <Menu
        style={{ width: 256, height: '100%', transform: isOpenHeader ? 'none' : 'translateX(-200%)' }}
        mode="inline"
        defaultSelectedKeys={["home"]}
        onClick={listItemSidebar}
        items={items}
      />    
    </div>
  );
}
