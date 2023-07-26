import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { GardenContext } from "../../contexts/GardenContext";
import { AuthContext } from "../../contexts/AuthContext";
import AuthApi from "../../api/auth";
import { Button, Modal, Select, SelectProps, Table, Empty } from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ChangeRole from "./ChangeRole";
import { IChangeRole } from "./ChangeRole";
import { MessageContext } from "../../contexts/MessageContext";

const { confirm } = Modal;

const convertRoleGarden = {
  MANAGER: "Quản lý",
  USER: "Nhân viên",
};

const getConvertedRole = (roleInGarden: any) => {
  return convertRoleGarden[roleInGarden as keyof typeof convertRoleGarden];
};

interface DataType {
  stt: any;
  name: string;
  role: any;
  garden: string;
  gardenId?: any;
  date: string;
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

const ManagementWorker = () => {
  const authApi = AuthApi.registerAuthApi();
  const gardenContext = useContext(GardenContext);
  const gardens = gardenContext?.gardens;
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [listUser, setLisUser] = useState<any>([]);
  const [dtoAddUser, setDtoAddUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeRole, setChangeRole] = useState<IChangeRole>();
  const [garden, setGarden] = useState<any>();
  const [totalPage, setTotalPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { gardenId } = useParams();
  const roleUserOfPage = authContext?.authInformation.user.role;
  const messageContext = useContext(MessageContext);

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
          roleInGarden: item.gardens[0].role,
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

  const getListUserSearch = async (dto: { gardenId: number }) => {
    const res = await authApi.getUsersWithoutGardenId(dto);
    if (res.success) {
      const data = res?.data?.users.map((item: any) => ({
        label: item.fullName,
        value: item.fullName,
        user: item,
      }));
      setListSearch(data);
    }
  };

  useEffect(() => {
    getListUserSearch({ gardenId: Number(gardenId) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gardenId]);

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
      if (res.success) {
        messageContext?.success("Them nguoi thanh cong");
        getAllUserByGardenId(garden);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //xử lý trong bảng--------------------------------------------
  let columns: ColumnsType<DataType> = [
    {
      title: "Stt",
      dataIndex: "stt",
      className: "responsive-hiden",
    },
    {
      title: "Name",
      dataIndex: "name",
      className: "row_ManagementWorker row_ManagementWorker-name",
    },
    {
      title: "Chức vụ",
      dataIndex: "roleInGarden",
      className: "row_ManagementWorker",
      render: (_, record: any) => {
        return getConvertedRole(record.roleInGarden);
      },
    },
    {
      title: "Khu vườn",
      dataIndex: "garden",
      className: "responsive-hiden",
    },
    {
      title: "Ngày tham gia khu vườn",
      dataIndex: "date",
      className: "responsive-hiden",
    },
  ];
  columns =
    roleUserOfPage === "ADMIN"
      ? [
          ...columns,
          {
            title: "Thao tác",
            className: "row_ManagementWorker-action",
            align: "center",
            render: (_, record) =>
              listUser.length > 0 ? (
                <>
                  <Button
                    onClick={() => showModal(record)}
                    type="primary"
                    ghost
                    size="small"
                  >
                    Cập nhật
                  </Button>
                  <Button
                    onClick={showDeleteConfirm}
                    style={{ marginLeft: "0.5rem" }}
                    danger
                    size="small"
                  >
                    Xóa
                  </Button>
                </>
              ) : null,
          },
        ]
      : columns;

  const showModal = (record: any) => {
    setChangeRole({
      garden: garden,
      roleInGarden: {
        value: record.roleInGarden,
        label: getConvertedRole(record.roleInGarden),
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
      {!gardenId ? (
        <ViewEmpty selectGarden={selectGarden} itemsOption={itemsOption} />
      ) : (
        <div className="ManagementWorker">
          <h3>Quản lý nhân viên</h3>
          <header>
            <label className="responsive-hiden">Chọn vườn: </label>
            <Select
              id="garden-select"
              style={{ width: 290 }}
              value={garden}
              onChange={selectGarden}
              options={itemsOption}
              placeholder={"Chọn khu vườn"}
            />
          </header>

          <div className="body-ManagementWorker">
            {/* thêm người vào khu vườn */}
            <div className="add_people">
              <span className="responsive-hiden">
                Thêm người vào khu vườn:{" "}
                {garden?.label || "Bạn hãy chọn khu vườn......."}
              </span>
              <div className="add_people-input">
                <span className="responsive-hiden">Thêm người: </span>
                <Select
                  suffixIcon={<SearchOutlined />}
                  showSearch
                  style={{ width: 300 }}
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
                className="table_test"
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
          {isModalOpen && (
            <ChangeRole
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              itemsOption={itemsOption}
              changeRole={changeRole}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ManagementWorker;
