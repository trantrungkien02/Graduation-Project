'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Modal } from 'antd'; // Thêm Select từ antd
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

    // State to handle pagination and search query
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('username'); // Trường tìm kiếm mặc định
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null); // State to handle debounce

    // Fetch user data
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllUsers(user?.accessToken, dispatch, axiosJWT);
        }
    }, []);

    // Effect to handle search query changes
    useEffect(() => {
        // Clear the previous timeout if it exists
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout to debounce the search
        const timeout = setTimeout(async () => {
            if (searchText) {
                // Gọi hàm tìm kiếm người dùng khi có từ khóa
                await searchUsers(user?.accessToken, dispatch, axiosJWT, searchField, searchText);
            } else {
                // Nếu không có từ khóa, gọi lại tất cả người dùng
                await getAllUsers(user?.accessToken, dispatch, axiosJWT);
            }
        }, 300); // Đặt thời gian debounce ở đây (300ms)

        setDebounceTimeout(timeout); // Lưu timeout vào state

        // Clean up the timeout on unmount
        return () => clearTimeout(timeout);
    }, [searchText, searchField]); // Cần thêm searchField vào dependencies

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: 'Xác nhận xóa người dùng',
            content: 'Bạn có chắc chắn muốn xóa người dùng này không?',
            okText: 'Có',
            cancelText: 'Không',
            style: {
                top: '40%', // Đưa modal vào giữa màn hình theo chiều dọc
            },
            onOk: async () => {
                await deleteUser(user?.accessToken, dispatch, id, axiosJWT);
                // Reload the user list after deletion
                if (user?.accessToken) {
                    getAllUsers(user?.accessToken, dispatch, axiosJWT);
                }
            },
        });
    };

    const handleTableChange = (pagination: any) => {
        setPagination(pagination); // Update pagination state when page is changed
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            render: (text: any, record: any, index: number) =>
                (pagination.current - 1) * pagination.pageSize + index + 1, // Calculate row number across pages
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
                            backgroundColor: '#b80000', // Màu nền đỏ
                            borderColor: '#b80000', // Màu viền đỏ
                            borderRadius: '5px', // Bo góc
                            color: 'white', // Màu chữ trắng
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
                    onChange={(e) => setSearchText(e.target.value)} // Cập nhật searchText mỗi khi gõ
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
                    pageSizeOptions: ['10', '15', '20'], // Tùy chọn hiển thị số hàng trên mỗi trang
                    showSizeChanger: true, // Cho phép thay đổi số hàng trên mỗi trang
                }}
                onChange={handleTableChange}
                scroll={{ y: pagination.pageSize > 5 ? 550 : undefined }} // Cuộn nếu có hơn 10 hàng
            />
        </div>
    );
};

export default UserList;
