import "./index.css";
import { Badge, Button, Divider, Dropdown, Space, Switch, theme } from "antd";
import { Link } from "react-router-dom";
import { BellFilled } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import type { MenuProps } from "antd";
import Avatar from "../../components/Avatar";
import React from "react";

const listNoti = [
  {
    id: 0,
    title: "Thông báo 1",
    content: "Nội dung thông báo 1.Nội dung thông báo 1.Nội dung thông báo 1.Nội dung thông báo 1.Nội dung thông báo 1.Nội dung thông báo 1.",
    url: "notification",
    status: false
  },
  {
    id: 1,
    title: "Thông báo 2",
    content: "Nội dung thông báo 2.Nội dung thông báo 2.Nội dung thông báo 2.",
    url: "notification",
    status: true
  },
  {
    id: 2,
    title: "Thông báo 3",
    content: "Nội dung thông báo 3.Nội dung thông báo 3.Nội dung thông báo 3.",
    url: "notification",
    status: false
  },
  {
    id: 3,
    title: "Thông báo 4",
    content: "Nội dung thông báo 4.Nội dung thông báo 4.Nội dung thông báo 4.",
    url: "notification",
    status: true
  },
  {
    id: 4,
    title: "Thông báo 5",
    content: "Nội dung thông báo 5.Nội dung thông báo 5.Nội dung thông báo 5.",
    url: "notification",
    status: false
  },
  {
    id: 5,
    title: "Thông báo 6",
    content: "Nội dung thông báo 5.Nội dung thông báo 5.Nội dung thông báo 5.",
    url: "notification",
    status: false
  },
  {
    id: 6,
    title: "Thông báo 7",
    content: "Nội dung thông báo 5.Nội dung thông báo 5.Nội dung thông báo 5.",
    url: "notification",
    status: false
  },
]

function ItemNotification(props: any) {
  const { title, content, url, status } = props
  return (
    <div style={{ borderBottom: "1px solid #beb9b9e0", display: "flex", justifyContent: "space-between" }}>
      <Link to={url} style={{ color: "black" }}>
        <h5 style={{ margin: "0" }}>{title}</h5>
        <div>{content}</div>
        <div style={{ fontSize: "0.7rem", color: "rgb(149, 200, 230)" }}>11/11/2001</div>
      </Link>
      {!status && <div style={{ display: 'flex', alignItems: "center", color: "rgb(149, 200, 230)" }}>o</div>}
    </div>
  );
}

function ItemProfile() {
  return (
    <Link to="personal-information">
      <div style={{ display: "flex" }}>
        <Avatar />
        <div style={{ marginLeft: '1rem' }}>
          <h4 style={{ margin: "0" }}>Họ và tên</h4>
          <div>Giới thiệu một chút về bản thân</div>
        </div>
      </div>
    </Link>
  );
}
const items: MenuProps["items"] = listNoti.map(noti => {
  return (
    {
      label: (<ItemNotification title={noti.title} content={noti.content} url={noti.url} status={noti.status} />),
      key: noti.id,
      // style: noti.status ? { backgroundColor: '#ebeaea' } : {},
    }
  )
}
)

const items2: MenuProps["items"] = [
  {
    label: ItemProfile(),
    key: "0",
  },
];
const { useToken } = theme;
export default function HeaderLayout() {
  let count = 0
  listNoti.map(noti => {
    if (noti.status !== true) {
      count += 1
    }
    return count
  })

  const { token } = useToken();
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle = {
    boxShadow: 'none',
  };
  return (
    <Header className="header">
      <div className="header_left">
        <h2>Quản lý khu vườn</h2>
      </div>

      <div className="header_right">
        <div>
          <Dropdown
            overlayClassName="custom-dropdown"
            trigger={['click']}
            menu={{ items }}
            dropdownRender={(menu) => (
              <div style={contentStyle}>
                <h3 style={{ margin: "0", padding: 8 }}>Thông báo</h3>
                <Space style={{ padding: 8 }}>
                  <button className='slectNotification' >Tất cả</button>
                  <button className='slectNotification' >Đã đọc</button>
                  <button className='slectNotification' >Chưa đọc</button>
                </Space>
                <Divider style={{ margin: 0 }} />
                {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
              </div>
            )}
          >
            <Space size="middle">
              <Badge count={count} >
                <BellFilled style={{ fontSize: 20 }} />
              </Badge>
            </Space>
          </Dropdown>
        </div>

        <div>
          <Dropdown
            overlayClassName="custom-dropdownPrivate"
            trigger={['click']}
            menu={{ items: items2 }}
            dropdownRender={(menu) => (
              <div style={contentStyle}>
                {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
                <Divider style={{ margin: 0 }} />
                <Space style={{ padding: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>Màn hình sáng</div>
                  <Switch defaultChecked onChange={() => <></>} />
                </Space>
                <Divider style={{ margin: 0 }} />
                <Space style={{ padding: 8 }}>
                  <Button>Đăng Xuất</Button>
                </Space>
              </div>
            )}
          >
            <Space size="middle">
              <Avatar />
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}
