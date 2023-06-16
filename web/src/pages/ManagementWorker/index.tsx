import { useContext, useEffect, useState } from "react";
import "./index.css";
import { GardenContext } from "../../contexts/GardenContext";
import AuthApi from "../../api/auth";
import { Button, Modal, Select, SelectProps, Space, Table } from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
const { confirm } = Modal;

// const roleUser = {
//   MANAGER: "Quản lý",
//   USER: "Nhân viên",
//   VIEWER: "Người xem",
// };

interface DataType {
  userId: any;
  label?: any;
  value?: any;
  stt: any;
  name: string;
  role: any;
  garden: string;
  gardenId?: any;
  date: string;
}

interface IShowModal {
  isModalOpen: any;
  setIsModalOpen: any;
  itemsOption: any;
  changeRole: any;
}

const showDeleteConfirm = () => {
  confirm({
    title: "Bạn có muốn tiếp tục xóa",
    icon: <ExclamationCircleFilled />,
    content: 'ấn "Cancel" để hủy',
    okText: "Xóa",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

const ShowModal: React.FC<IShowModal> = ({
  isModalOpen,
  setIsModalOpen,
  itemsOption,
  changeRole,
}) => {
  // const { garden, role } = changeRole
  const [dto, setDto] = useState({});

  const itemsRole: SelectProps["options"] = [
    {
      value: "MANAGER",
      label: "MANAGER",
    },
    {
      value: "USER",
      label: "USER",
    },
    {
      value: "VIEWER",
      label: "VIEWER",
    },
  ];
  const handleOk = () => {
    console.log(dto);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const selectGarden = (value: any, item: any) => {
    setDto({
      ...dto,
      garden: item,
    });
  };
  const selectRole = (value: any, item: any) => {
    setDto({
      ...dto,
      role: item,
    });
  };
  return (
    <Modal
      title="Thay đổi quyền người dùng"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div>
        <Space>Chọn khu vườn</Space>
        <Select
          suffixIcon={<SearchOutlined />}
          showSearch
          style={{ width: "100%" }}
          // value={garden}
          onChange={selectGarden}
          options={itemsOption}
          placeholder="Tìm kiếm khu vườn"
        />
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <Space>Chọn chức vụ</Space>
        <Select
          suffixIcon={<SearchOutlined />}
          showSearch
          style={{ width: "100%" }}
          options={itemsRole}
          onChange={selectRole}
          placeholder="Chức vụ"
        />
      </div>
    </Modal>
  );
};

const ManagementWorker = () => {
  const authApi = AuthApi.registerAuthApi();
  const gardenContext = useContext(GardenContext);
  const gardens = gardenContext?.gardens;
  const [listUser, setLisUser] = useState<any>([]);
  const [dtoAddUser, setDtoAddUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeRole, setChangeRole] = useState<any>();

  //lấy tất cả khu vườn về-------------------------------------------
  useEffect(() => {
    gardenContext?.getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //danh sách khu vườn trong select

  const getAllUserByGardenId = async (garden: any) => {
    const dto = { gardenId: garden?.id };
    try {
      const res = await authApi.getUsersByGardenId(dto);
      ///1 lỗi warning (chưa có key trong map)
      const data = res?.data?.map((item: any, index: any) => {
        return {
          key: index,
          stt: index + 1,
          name: item.user.fullName,
          role: item.role,
          garden: garden.name,
          gardenId: garden.id,
          date: item.user.createdAt,
          lable: item.user.fullName,
          value: item.user.fullName,
          userId: item.user.id,
        };
      });
      setLisUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [garden, setGarden] = useState<any>();

  useEffect(() => {
    if (gardens?.[0]) {
      setGarden({
        id: gardens?.[0]?.id,
        value: gardens?.[0]?.name,
        label: gardens?.[0]?.name,
      });
      getAllUserByGardenId(gardens?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardens?.[0]]);

  const itemsOption: SelectProps["options"] =
    gardens?.map((garden) => ({
      id: garden.id,
      value: garden.name,
      label: garden.name,
    })) || [];

  //chọn khu vườn--------------------------------------------------------
  const selectGarden = async (value: any, item: any) => {
    const garden = gardens?.find((garden) => garden.id === item.id);
    if (garden) {
      setGarden(item);
      await getAllUserByGardenId(garden);
    } else {
      setLisUser([]);
    }
  };

  //thêm người vào khu vườn-----------------------------------------------
  const handleChange = (value: string, item: any) => {
    const { gardenId, userId, role } = item;
    setDtoAddUser({
      gardenId,
      userId,
      role,
    });
  };
  const addUser = async () => {
    console.log(dtoAddUser);
    // try {
    //     const dto = {...dtoAddUser}
    //     const res = await authApi.upsertGardensOnUser(dto)
    //     console.log(res)
    // } catch (error) {
    //     console.log(error)
    // }
  };

  //xử lý trong bảng--------------------------------------------
  const columns: ColumnsType<DataType> = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 10,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Nhiệm vụ",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Khu vườn",
      dataIndex: "garden",
      sorter: (a, b) => a.garden.localeCompare(b.garden),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "",
      dataIndex: "",
      render: (_, record) =>
        listUser.length > 0 ? (
          <>
            <Button onClick={() => showModal(record)} type="primary" ghost>
              Thay đổi quyền
            </Button>
            <Button
              onClick={showDeleteConfirm}
              style={{ marginLeft: "0.5rem" }}
              danger
            >
              Xóa
            </Button>
          </>
        ) : null,
      width: 230,
    },
  ];
  const showModal = (record: any) => {
    setChangeRole({
      garden: garden,
      role: {
        value: record.role,
        label: record.role,
        userId: record.userId,
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="ManagementWorker">
      <header>
        <label>Chọn vườn: </label>
        <Select
          id="garden-select"
          style={{ width: 200 }}
          value={garden}
          onChange={selectGarden}
          options={itemsOption}
          placeholder={"Chọn khu vườn"}
        />
      </header>

      <div className="body-ManagementWorker">
        {/* thêm người vào khu vườn */}
        <div
          style={{
            margin: "1rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Thêm người vào khu vườn: {garden?.label}</span>
          <div style={{ width: "50%" }}>
            <span>Them nguoi: </span>
            <Select
              suffixIcon={<SearchOutlined />}
              showSearch
              style={{ width: "70%" }}
              onChange={handleChange}
              options={listUser}
              placeholder="Tìm kiếm người"
            />

            <Button
              onClick={addUser}
              type="primary"
              style={{ marginLeft: "1rem" }}
            >
              Thêm
            </Button>
          </div>
        </div>

        {/* bảng user  */}
        <div>
          <Table
            bordered={true}
            pagination={false}
            columns={columns}
            dataSource={listUser}
          />
        </div>
      </div>
      <ShowModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        itemsOption={itemsOption}
        changeRole={changeRole}
      />
    </div>
  );
};

export default ManagementWorker;
