'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createAxios } from '~/app/createInstance';
import './index.scss';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { deleteUser, getAllUsers, searchUsers } from '~/redux/stateglobal/apiRequest';

const UserList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const userList = useSelector((state: any) => state.users.users?.allUsers);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('username');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllUsers(user?.accessToken, dispatch, axiosJWT);
        }
    }, []);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(async () => {
            if (searchText) {
                await searchUsers(user?.accessToken, dispatch, axiosJWT, searchField, searchText);
            } else {
                await getAllUsers(user?.accessToken, dispatch, axiosJWT);
            }
        }, 300);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchText, searchField]);

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: 'Xác nhận xóa người dùng',
            content: 'Bạn có chắc chắn muốn xóa người dùng này không?',
            okText: 'Có',
            cancelText: 'Không',
            style: {
                top: '40%',
            },
            onOk: async () => {
                await deleteUser(user?.accessToken, dispatch, id, axiosJWT);
                if (user?.accessToken) {
                    getAllUsers(user?.accessToken, dispatch, axiosJWT);
                }
            },
        });
    };

    const handleTableChange = (pagination: any) => {
        setPagination(pagination);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            render: (text: any, record: any, index: number) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (role: string) => (role === '1' ? 'Học viên' : role === '2' ? 'Giảng viên' : 'Admin'),
        },
        {
            title: 'Hành động',
            render: (text: any, record: any) => (
                <>
                    <Button
                        onClick={() => handleDelete(record._id)}
                        style={{
                            backgroundColor: '#b80000',
                            borderColor: '#b80000',
                            borderRadius: '5px',
                            color: 'white',
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className="home-container pl-[40px] pr-[50px]">
            <div className="user-title">Danh sách người dùng</div>
            <div className="user-role mb-6">{`Quyền truy cập: ${user?.role === '3' ? `Admin` : `User`}`}</div>

            {/* Input Search */}
            <Input.Group compact style={{ marginBottom: '20px', borderRadius: '20px' }}>
                <Select
                    defaultValue="username"
                    onChange={setSearchField}
                    style={{ width: '10%', borderRadius: '20px' }}
                >
                    <Select.Option value="username">Tên</Select.Option>
                    <Select.Option value="email">Email</Select.Option>
                </Select>
                <Input.Search
                    placeholder="Tìm kiếm"
                    onChange={(e) => setSearchText(e.target.value)}
                    enterButton
                    style={{ width: '90%', borderRadius: '20px' }}
                />
            </Input.Group>

            <Table
                dataSource={userList}
                columns={columns}
                rowKey="_id"
                pagination={{
                    ...pagination,
                    pageSizeOptions: ['10', '15', '20'],
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                scroll={{ y: pagination.pageSize > 5 ? 550 : undefined }}
            />
        </div>
    );
};

export default UserList;
