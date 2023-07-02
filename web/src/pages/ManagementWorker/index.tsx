import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { GardenContext } from "../../contexts/GardenContext";
import { AuthContext } from "../../contexts/AuthContext";
import AuthApi from "../../api/auth";
import { Button, Modal, Select, SelectProps, Space, Table, Empty } from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
const { confirm } = Modal;

interface DataType {
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
  changeRole:
    | {
        garden?: any;
        role?: any;
      }
    | undefined;
}

export interface IViewEmpty {
  selectGarden: any;
  itemsOption: any;
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

export const ViewEmpty: React.FC<IViewEmpty> = ({
  selectGarden,
  itemsOption,
}) => {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 280 }}
      description={
        <div>
          Chọn khu vườn
          <br />
          <br />
          <Select
            id="garden-select"
            style={{ width: 200 }}
            onChange={selectGarden}
            options={itemsOption}
            placeholder={"Chọn khu vườn"}
          />
        </div>
      }
    ></Empty>
  );
};

const ShowModal: React.FC<IShowModal> = ({
  isModalOpen,
  setIsModalOpen,
  itemsOption,
  changeRole,
}) => {
  const garden = changeRole?.garden;
  const role = changeRole?.role;
  const [dto, setDto] = useState<{
    gardenId?: number;
    userId?: number;
    role?: string;
  }>({});
  useEffect(() => {
    setDto({
      gardenId: garden?.garden.id,
      userId: role?.userId,
      role: role?.value,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRole]);
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
  const handleOk = async () => {
    try {
      const authApi = AuthApi.registerAuthApi();
      const res = await authApi.upsertGardensOnUser(dto);
      console.log(res);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const selectGarden = (value: any, item: any) => {
    setDto({
      ...dto,
      gardenId: item.id,
    });
  };
  const selectRole = (value: any, item: any) => {
    setDto({
      ...dto,
      role: item.value,
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
          value={garden}
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
          value={role}
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
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [listUser, setLisUser] = useState<any>([]);
  const [dtoAddUser, setDtoAddUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeRole, setChangeRole] = useState<{
    garden?: any;
    roleInGarden?: any;
  }>();
  const [garden, setGarden] = useState<any>();
  const [totalPage, setTotalPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { gardenId } = useParams();
  const roleUserOfPage = authContext?.authInformation.user.role;

  //lấy tất cả khu vườn về-------------------------------------------
  useEffect(() => {
    gardenContext?.getGardens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //refreshtUrl
  useEffect(() => {
    const newGarden = gardens?.find((value) => value.id === Number(gardenId));
    if (newGarden) {
      setGarden({
        id: newGarden?.id,
        value: newGarden?.name,
        label: newGarden?.name,
        garden: newGarden,
      });
      getAllUserByGardenId({
        id: newGarden?.id,
        value: newGarden?.name,
        label: newGarden?.name,
        garden: newGarden,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardens]);
  const getAllUserByGardenId = async (
    garden: any,
    page?: number | undefined,
    limit: number = 7
  ) => {
    const dto = { gardenId: garden?.id, page: page };
    try {
      const res = await authApi.getUsers(dto);
      let stt = 0;
      if (page) {
        stt = (page - 1) * limit;
      }
      setTotalPage(res?.data?.totalRecords);
      const data = res?.data?.users?.map((item: any, index: any) => {
        return {
          key: index,
          stt: index + 1 + stt,
          name: item.user.fullName,
          roleInGarden:
            item.gardens[0].role === "MANAGER" ? "Quản lý" : "Nhân viên",
          garden: garden.garden.name,
          gardenId: garden.id,
          date: dayjs(item.gardens[0].createdAt).format("YYYY-MM-DD"),
          lable: item.user.fullName,
          value: item.user.fullName,
          userId: item.user.id,
        };
      });
      setLisUser(data);
    } catch (error) {}
  };
  const itemsOption: SelectProps["options"] =
    gardens?.map((garden) => ({
      id: garden.id,
      value: garden.name,
      label: garden.name,
    })) || [];
  //chọn khu vườn--------------------------------------------------------
  const selectGarden = async (value: any, item: any) => {
    setCurrentPage(1);
    const garden = gardens?.find((garden) => garden.id === item.id);
    if (garden) {
      setGarden({ ...item, garden: garden });
      await getAllUserByGardenId({ ...item, garden: garden }, undefined);
      navigate(`/management-worker/${garden.id}`);
    } else {
      setLisUser([]);
    }
  };
  //thêm người vào khu vườn-----------------------------------------------

  const [listSearch, setListSearch] = useState([]);
  const [search, setSearch] = useState<string | undefined>();

  const getListUserSearch = async (dto: { name?: string }) => {
    // const res = await authApi.getListUser(dto);
    // const data = res?.data?.map((item: any) => ({
    //   label: item.fullName,
    //   value: item.fullName,
    //   user: item,
    // }));
    // setListSearch(data);
  };

  useEffect(() => {
    const handleSearch = setTimeout(() => {
      getListUserSearch({ name: search });
    }, 500);

    return () => clearTimeout(handleSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  const searchUser = (value: string) => {
    setSearch(value);
  };

  const handleChange = (value: string, item: any) => {
    setDtoAddUser({
      gardenId: Number(gardenId),
      userId: item.user.id,
      role: "USER",
    });
  };

  const addUser = async () => {
    try {
      const dto = { ...dtoAddUser };
      const res = await authApi.upsertGardensOnUser(dto);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  //xử lý trong bảng--------------------------------------------
  let columns: ColumnsType<DataType> = [
    {
      title: "Stt",
      dataIndex: "stt",
      width: 10,
    },
    {
      title: "Name",
      dataIndex: "name",
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Chức vụ",
      dataIndex: "roleInGarden",
      // sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Khu vườn",
      dataIndex: "garden",
      // sorter: (a, b) => a.garden.localeCompare(b.garden),
    },
    {
      title: "Ngày tham gia khu vườn",
      dataIndex: "date",
      // sorter: (a, b) => a.date.localeCompare(b.date),
    },
  ];
  columns =
    roleUserOfPage === "ADMIN"
      ? [
          ...columns,
          {
            title: "Thao tác",
            render: (_, record) =>
              listUser.length > 0 ? (
                <>
                  <Button
                    onClick={() => showModal(record)}
                    type="primary"
                    ghost
                  >
                    Cập nhật
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
        ]
      : columns;

  const showModal = (record: any) => {
    setChangeRole({
      garden: garden,
      roleInGarden: {
        value: record.role,
        label: record.role,
        userId: record.userId,
      },
    });
    setIsModalOpen(true);
  };

  const changPagination = async (pagination: TablePaginationConfig) => {
    setCurrentPage(Number(pagination.current));
    await getAllUserByGardenId(garden, pagination.current);
  };

  return (
    <>
      {gardens && !garden ? (
        <ViewEmpty selectGarden={selectGarden} itemsOption={itemsOption} />
      ) : (
        <div className="ManagementWorker">
          <header>
            <label>Chọn vườn: </label>
            <Select
              id="garden-select"
              style={{ width: 200 }}
              defaultValue={garden}
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
              <span>
                Thêm người vào khu vườn:{" "}
                {garden?.label || "Bạn hãy chọn khu vườn......."}
              </span>
              <div style={{ width: "50%", float: "right" }}>
                <span>Thêm người: </span>
                <Select
                  onSearch={searchUser}
                  suffixIcon={<SearchOutlined />}
                  showSearch
                  style={{ width: "60%" }}
                  onChange={handleChange}
                  options={listSearch}
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
                onChange={changPagination}
                bordered={true}
                pagination={{
                  pageSize: 7,
                  total: totalPage,
                  current: currentPage,
                }}
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
      )}
    </>
  );
};

export default ManagementWorker;
