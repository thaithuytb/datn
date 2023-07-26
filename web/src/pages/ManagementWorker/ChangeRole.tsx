import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Modal, Select, SelectProps, Space } from "antd";
import AuthApi from "../../api/auth";

export interface IChangeRole {
  garden: {
    garden: any;
    id: number;
    label: string;
    value: string;
  };
  roleInGarden: {
    label: string;
    userId: number;
    value: string;
  };
}

interface IShowModal {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  itemsOption: any;
  changeRole: IChangeRole | undefined;
}

const ChangeRole: React.FC<IShowModal> = ({
  isModalOpen,
  setIsModalOpen,
  changeRole,
}) => {
  const [changeRoleProps, setChangeRoleProps] = useState<IChangeRole>();
  const [dto, setDto] = useState<{
    gardenId?: number;
    userId?: number;
    role?: string;
  }>({});
  useEffect(() => {
    setDto({
      gardenId: changeRole?.garden?.garden.id,
      userId: changeRole?.roleInGarden?.userId,
      role: changeRole?.roleInGarden?.value,
    });
    setChangeRoleProps(changeRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRole]);
  const itemsRole: SelectProps["options"] = [
    {
      value: "MANAGER",
      label: "Quản lý",
    },
    {
      value: "USER",
      label: "Nhân viên",
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

  const selectRole = (value: any, item: any) => {
    setDto({
      ...dto,
      role: item.value,
    });
  };
  if (!changeRoleProps) return <></>;

  return (
    <Modal
      title="Thay đổi quyền người dùng"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div style={{ marginTop: "1.5rem" }}>
        <Space>Chọn chức vụ</Space>
        <Select
          suffixIcon={<SearchOutlined />}
          showSearch
          defaultValue={changeRoleProps.roleInGarden}
          style={{ width: "100%" }}
          options={itemsRole}
          onChange={selectRole}
          placeholder="Chức vụ"
        />
      </div>
    </Modal>
  );
};

export default ChangeRole;
