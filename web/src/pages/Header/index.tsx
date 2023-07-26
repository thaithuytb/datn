import React, { useContext, useMemo, useState } from "react";
import "./index.css";
import { Badge, Button, Divider, Dropdown, Space, Switch, theme } from "antd";
import { Link } from "react-router-dom";
import { BellFilled } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import type { MenuProps } from "antd";
import Avatar from "../../components/Avatar";
import { AuthContext } from "../../contexts/AuthContext";
import { colorHeader } from "../../types/variableMain";
import { NotificationContext } from "../../contexts/NotificationContext";
import { INotification } from "../../contexts/NotificationContext";
import NotificationApi from "../../api/notification";

interface IItemNotification {
  noti: INotification
}

const ItemNotification: React.FC<IItemNotification> = ({ noti }) => {
  const notificationContext = useContext(NotificationContext);
  const setCount = notificationContext?.setCount;
  // const count = notificationContext?.count;
  const notification = noti.notification
  const notificationStatus = noti.notificationStatus
  const update = async () => {
    const notificationApi = new NotificationApi();
    try {
      const res = await notificationApi.updateNotificationsOnUsers({ notificationId: noti.notification.id })
      if (res.success) {
        console.log(res)
        setCount((count: number) => count - 1)
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }
  return (
    <div onClick={update} style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <h3 style={{ margin: "0" }}>{notification.title}</h3>
        <div>{notification.description}</div>
        <div style={{ fontSize: "0.7rem", color: `${colorHeader}` }}>11/11/2001</div>
      </div>
      {!notificationStatus.seen && <div style={{ display: 'flex', alignItems: "center", color: "rgb(149, 200, 230)" }}>o</div>}
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

//danh sách private
const items2: MenuProps["items"] = [
  {
    label: ItemProfile(),
    key: "0",
  },
];
const { useToken } = theme;


export default function HeaderLayout() {
  const [typeNotification, setTypeNotification] = useState<string>("")
  const authContext = useContext(AuthContext)
  const notificationContext = useContext(NotificationContext)
  const notifications = notificationContext?.notifications
  const count = notificationContext?.count
  const setNotifilcations = notificationContext?.setNotifilcations
  const notificationApi = new NotificationApi();
  const [page, setPage] = useState<number>(1)

  const name = authContext?.authInformation?.user?.fullName || "user"

  const { token } = useToken();
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle = {
    boxShadow: 'none',
  };

  //danh sách thông báo
  const items: MenuProps["items"] = notifications.map((noti: INotification) => {
    return (
      {
        label: (<ItemNotification noti={noti} />),
        key: noti.notification.id,
        style: !noti.notificationStatus.seen ? { marginBottom: '0.2rem', backgroundColor: 'rgba(0, 0, 0, 0.05)', } : { marginBottom: "0.2rem" },
      }
    )
  }
  )

  const getNotificationByType = async (type: string) => {
    console.log(page)
    setTypeNotification(type)
    try {
      const dto = {
        type: type,
        seen: false,
        page: page,
        limit: 10
      }
      const res = await notificationApi.getNotification(dto)
      if (res && setNotifilcations) {
        if (page === 1 || type === typeNotification) {
          setNotifilcations([...res.data.notifications])
        } else {
          setNotifilcations((notifications: any) => ([...notifications, ...res.data.notifications]))
        }
      }
    } catch (error) { }
  }

  const showNotification = async (open: boolean) => {
    if (open) {
      getNotificationByType(typeNotification)
    }
  }

  const throttle = useMemo(() => {
    let lastCall = 0;
    return function () {
      const now = new Date().getTime();
      if (now - lastCall < 500) {
        return;
      }
      lastCall = now;
      getNotificationByType(typeNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = () => {
    const node = document.getElementById("Dropdown_before")
    let scrollTop = 0
    node?.parentElement?.addEventListener('scroll', (event: any) => {
      if (event.target.scrollTop > scrollTop && event.target.offsetHeight + event.target.scrollTop > event.target.scrollHeight) {
        throttle()
        setPage(page + 1)
      }
      scrollTop = event.target.scrollTop
    })
  };

  handleScroll()

  return (
    <Header className="header">
      <div className="header_left">
        <img style={{ width: "38px", height: "auto", marginRight: "0.5rem" }}
          src="https://upload.wikimedia.org/wikipedia/vi/thumb/e/ef/Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_B%C3%A1ch_Khoa_H%C3%A0_N%E1%BB%99i.svg/1200px-Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_B%C3%A1ch_Khoa_H%C3%A0_N%E1%BB%99i.svg.png" alt="" />
        <h2>Đại học Bách Khoa Hà Nội</h2>
      </div>

      <div className="header_right">
        <h3>Xin chào {name}</h3>

        <div>
          <Dropdown
            onOpenChange={showNotification}
            overlayClassName="custom-dropdown"
            trigger={['click']}
            menu={{ items }}
            // getPopupContainer={}
            dropdownRender={(menu) => (
              <div style={contentStyle}
                id="Dropdown_before"
              >
                <h3 style={{ margin: "0", padding: 8 }}>Thông báo</h3>
                <Space style={{ padding: 8 }}>
                  <button onClick={() => getNotificationByType("")}
                    className='slectNotification'
                    style={{ backgroundColor: typeNotification === '' ? colorHeader : '', color: typeNotification === 'GARDEN' ? 'white' : '' }}
                  >
                    Tat ca
                  </button>
                  <button onClick={() => getNotificationByType("GARDEN")}
                    className='slectNotification'
                    style={{ backgroundColor: typeNotification === 'GARDEN' ? colorHeader : '', color: typeNotification === 'GARDEN' ? 'white' : '' }}
                  >
                    GARDEN
                  </button>
                  <button onClick={() => getNotificationByType("DEVICE")}
                    className='slectNotification'
                    style={{ backgroundColor: typeNotification === 'DEVICE' ? colorHeader : '', color: typeNotification === 'DEVICE' ? 'white' : '' }}
                  >
                    DEVICE
                  </button>
                  <button onClick={() => getNotificationByType("OTHER")}
                    className='slectNotification' style={{ backgroundColor: typeNotification === 'OTHER' ? colorHeader : '', color: typeNotification === 'OTHER' ? 'white' : '' }}
                  >
                    OTHER
                  </button>
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
      </div >
    </Header >
  );
}
