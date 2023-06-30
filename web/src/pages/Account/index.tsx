import "./index.css"
import { ColumnsType } from "antd/es/table";
import { Button, Input, Modal, Table } from 'antd'
import { useEffect, useState } from "react";
import AuthApi from "../../api/auth";
import Profile from "./Profile";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const { confirm } = Modal;

interface InformationAccount {
    stt: number
    id: number
    fullname: string
    email: string
    address: string
    phoneNumber: string
    gender: string
    dateCreateAccount: string
    dateJoin: string
    dateOfBrith: string
    avata?: string
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

const Account = () => {

    const navigate = useNavigate()
    const [account, setAccount] = useState<InformationAccount>()
    const [listAccount, setListAccount] = useState<InformationAccount[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    //navigate create account
    const create = () => {
        navigate("/account/create-account")
    }
    //hàm tìm kiếm theo tên
    const onSearch = (value: string) => console.log(value);

    //cột trong bảng
    const columns: ColumnsType<InformationAccount> = [
        {
            title: "Stt",
            dataIndex: "stt",
            width: 10,
        },
        {
            title: "Tên",
            dataIndex: "fullname",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Ngày sinh",
            dataIndex: "dateOfBrith",
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
        },
        {
            title: "",
            dataIndex: "",
            render: (_, record) =>
                listAccount.length > 0 ? (
                    <>
                        <Button onClick={() => showModal(record)} type="primary" ghost>
                            Chi tiết
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
            width: 180,
        }
    ];

    const showModal = (record: any) => {
        setAccount(record)
        setIsModalOpen(true);
    };

    const getAccount = async (gardenId: number, page?: number | undefined, limit: number = 10) => {
        const dto = { gardenId, page };
        try {
            const authApi = AuthApi.registerAuthApi()
            const res = await authApi.getUsersByGardenId(dto);
            let stt = 0
            if (page) {
                stt = (page - 1) * limit
            }
            const data = res?.data?.users.map((user: any, index: number) => {
                const dateOfBrith = new Date(user.user.createdAt);
                return ({
                    stt: stt += 1,
                    id: user.user.id,
                    fullname: user.user.fullName,
                    email: user.user.email,
                    address: user.user.address,
                    phoneNumber: user.user.phoneNumber,
                    gender: user.user.gender,
                    dateCreateAccount: user.user.createdAt,
                    dateJoin: user.user.createdAt,
                    dateOfBrith: `${dateOfBrith.getDate()}-${dateOfBrith.getMonth() + 1}-${dateOfBrith.getFullYear()}`,
                    avata: user.user.fullName
                })
            })
            setListAccount(data)
        } catch (error) { }
    };
    useEffect(() => {
        getAccount(1)
    }, [])
    return (
        <div style={{ padding: '1rem' }}>
            <header className='titleAccount'>
                <h3>Quản lý tài khoản</h3>
                <Button type="primary" ghost onClick={create}>Thêm tài khoản</Button>
            </header>

            <div className="SearchAccount">
                <span style={{ marginRight: "100px" }}>Tìm kiếm: </span>
                <Search placeholder="Nhập tên muốn tìm..." allowClear onSearch={onSearch} style={{ width: 400 }} />
            </div>

            <Table
                //   onChange={changPagination}
                bordered={true}
                //   pagination={{
                //     pageSize: 7,
                //     total: totalPage,
                //     current: currentPage
                //   }}
                columns={columns}
                dataSource={listAccount}
            />
            <Profile
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                account={account}
            />
        </div>
    )
}

export default Account