'use client';
import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Table, message } from 'antd';
import { useRouter } from 'next/navigation';
import {
    deleteNotify,
    getNotifyById,
    getNotifyForAdmin,
    searchNotify,
    updateNotify,
} from '~/redux/stateglobal/apiRequest'; // Giả sử hàm này nằm ở đây
import { createAxios } from '~/app/createInstance';
import { useDispatch, useSelector } from 'react-redux';
import { logOutSuccess } from '~/redux/stateglobal/authSlice';

const NotifyList = () => {
    const [notifyList, setNotifyList] = useState([]); // Lưu danh sách thông báo
    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('tittle');

    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const [editingNotify, setEditingNotify] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const router = useRouter();
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, logOutSuccess);

    useEffect(() => {
        if (!user || !user.accessToken) {
            router.push('/login');
        } else {
            fetchNotifyList(); // Lấy danh sách thông báo khi trang tải
        }
    }, []);

    // Hàm gọi API để lấy danh sách thông báo
    const fetchNotifyList = async (search?: string) => {
        try {
            setLoading(true);
            const response = await getNotifyForAdmin(user._id, axiosJWT); // Sử dụng hàm có sẵn
            setNotifyList(response || []);
        } catch (error) {
            message.error('Không thể tải danh sách thông báo.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý tìm kiếm với debounce
    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(async () => {
            if (searchText) {
                const response = await searchNotify(user?.accessToken, axiosJWT, searchField, searchText, user?._id);
                setNotifyList(response);
            } else {
                const response = await getNotifyForAdmin(user._id, axiosJWT); // Sử dụng hàm có sẵn
                setNotifyList(response);
            }
        }, 300);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchText]);

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: 'Xác nhận xóa khóa học',
            content: 'Bạn có chắc chắn muốn xóa khóa học này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                await deleteNotify(user?.accessToken, id, axiosJWT);
                if (user?.accessToken) {
                    const response = await getNotifyForAdmin(user._id, axiosJWT); // Sử dụng hàm có sẵn
                    setNotifyList(response);
                }
            },
        });
    };

    const handleEdit = async (notifyId: string) => {
        const notifyData = await getNotifyById(notifyId, axiosJWT);
        setEditingNotify(notifyData);
        form.setFieldsValue(notifyData);
        setIsModalVisible(true);
        console.log(notifyId);
    };

    const handleSaveEdit = async () => {
        try {
            const values = form.getFieldsValue(); // Lấy giá trị từ form
            console.log(values);
            await updateNotify(user?.accessToken, dispatch, { ...editingNotify, ...values }, axiosJWT);
            message.success('Thông báo đã được cập nhật thành công!');
            setIsModalVisible(false); // Ẩn modal
            const response = await getNotifyForAdmin(user._id, axiosJWT); // Sử dụng hàm có sẵn
            setNotifyList(response);
        } catch (error) {
            console.error('Cập nhật thông báo thất bại:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsModalVisible(false);
    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: any, record: any, index: number) => index + 1,
            width: '5%',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'tittle',
            key: 'tittle',
            width: '20%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'des',
            key: 'des',
            width: '60%',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text: any, record: any) => (
                <>
                    <Button
                        style={{
                            backgroundColor: '#ffc107',
                            borderColor: '#ffc107',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '20px',
                        }}
                        onClick={() => handleEdit(record._id)}
                    >
                        Sửa
                    </Button>
                    <Button
                        onClick={() => handleDelete(record._id)}
                        style={{
                            backgroundColor: '#b80000',
                            borderColor: '#b80000',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '20px',
                        }}
                    >
                        Xóa
                    </Button>
                </>
            ),
            width: '20%',
        },
    ];

    return (
        <div className="notify-container pl-[40px] pr-[50px]">
            {/* Search Section */}
            <Input.Group compact style={{ marginBottom: '20px', borderRadius: '20px' }}>
                <Select defaultValue="tittle" onChange={setSearchField} style={{ width: '10%', borderRadius: '20px' }}>
                    <Select.Option value="tittle">Tên</Select.Option>
                    <Select.Option value="des">Mô tả</Select.Option>
                </Select>
                <Input.Search
                    placeholder="Tìm kiếm thông báo"
                    onChange={(e) => setSearchText(e.target.value)}
                    enterButton
                    style={{ marginBottom: '20px', borderRadius: '20px', width: '90%' }}
                />
            </Input.Group>
            {/* Ant Design Table */}
            <Table
                columns={columns}
                dataSource={notifyList}
                rowKey={(record) => record._id}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            <Modal
                title="Chỉnh sửa khóa học"
                visible={isModalVisible}
                onOk={handleSaveEdit}
                onCancel={handleCancelEdit}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên thông báo" name="tittle">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả thông báo" name="des">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Người nhận"
                        name="role"
                        rules={[{ required: false, message: 'Người nhận không được để trống' }]}
                        initialValue="all"
                    >
                        <Select
                            showSearch
                            placeholder="Tất cả"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                {
                                    value: 'all',
                                    label: 'Tất cả',
                                },
                                {
                                    value: '1',
                                    label: 'Học viên',
                                },
                                {
                                    value: '2',
                                    label: 'Giảng viên',
                                },
                            ]}
                            className="w-[344px] select-regis"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NotifyList;
