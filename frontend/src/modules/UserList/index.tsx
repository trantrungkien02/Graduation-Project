'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createAxios } from '~/app/createInstance';
import './index.scss';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { deleteUser, getAllUsers, searchUsers, updateUser } from '~/redux/stateglobal/apiRequest';

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

    const handleDelete = (currentUser: any) => {
        Modal.confirm({
            title: 'Xác nhận thực hiện hành động!',
            content: 'Bạn có chắc chắn muốn thực hiện hoạt động này không?',
            okText: 'Có',
            cancelText: 'Không',
            style: {
                top: '20%',
            },
            onOk: async () => {
                const updatedUser = {
                    ...currentUser,
                    isLimit: currentUser.isLimit === '1' ? '0' : '1',
                };
                await axiosJWT.put('http://localhost:8000/v1/user/update-user', updatedUser);
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
            width: '5%',
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
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (role: string) => (role === '1' ? 'Học viên' : role === '2' ? 'Giảng viên' : 'Admin'),
        },
        {
            title: 'Trạng thái',
            render: (text: any, record: any) => (
                <>
                    <div className="flex items-center">
                        <Button
                            style={{
                                backgroundColor: record.isLimit === '0' ? '#008000' : '#FFA500', // Xanh lá nếu '0', vàng nếu khác '0'
                                marginRight: '10px',
                                color: 'white',
                                marginTop: '8px',
                            }}
                        >
                            {record.isLimit === '0' ? 'Hoạt động' : 'Giới hạn'}
                        </Button>

                        <Button
                            onClick={() => handleDelete(record)}
                            style={{
                                backgroundColor: record.isLimit === '0' ? '#b80000' : '#008000', // Đỏ nếu '0', xanh lá nếu khác '0'
                                borderColor: record.isLimit === '0' ? '#b80000' : '#008000',
                                borderRadius: '5px',
                                color: 'white',
                                marginTop: '8px',
                            }}
                        >
                            {record.isLimit === '0' ? 'Tắt' : 'Bật'} {/* Hiển thị Tắt nếu '0', Bật nếu khác '0' */}
                        </Button>
                    </div>
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
