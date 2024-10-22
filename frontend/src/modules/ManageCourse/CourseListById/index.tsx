'use client';
import { useEffect, useState } from 'react';
import { Button, Input, Select, Modal, Form, message, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import {
    deleteCourse,
    getAllCoursesByIdUser,
    searchCourses,
    updateCourse,
    getCourseById,
} from '~/redux/stateglobal/apiRequest';

const CourseList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCoursesById ?? []); // Ensure it's an array
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('name');
    const [editingCourse, setEditingCourse] = useState<any>(null); // Trạng thái đang edit
    const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
    const [form] = Form.useForm(); // Khởi tạo form từ Ant Design
    const [currentCourseList, setCurrentCourseList] = useState(courseList);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
        }
    }, []);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(async () => {
            if (searchText) {
                await searchCourses(user?.accessToken, dispatch, axiosJWT, searchField, searchText);
            } else {
                await getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
            }
        }, 300);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchText, searchField]);

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: 'Xác nhận xóa khóa học',
            content: 'Bạn có chắc chắn muốn xóa khóa học này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                await deleteCourse(user?.accessToken, dispatch, id, axiosJWT);
                if (user?.accessToken) {
                    const updatedCourse = await getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
                    setCurrentCourseList(updatedCourse);
                }
            },
        });
    };

    const handleEdit = async (courseId: string) => {
        const courseData = await getCourseById(user?.accessToken, courseId, dispatch, axiosJWT);
        setEditingCourse(courseData); // Lưu dữ liệu khóa học đang chỉnh sửa
        form.setFieldsValue(courseData); // Đặt giá trị form với dữ liệu từ API
        setIsModalVisible(true); // Hiển thị modal
    };

    const handleSaveEdit = async () => {
        try {
            const values = form.getFieldsValue(); // Lấy giá trị từ form
            await updateCourse(user?.accessToken, dispatch, { ...editingCourse, ...values }, axiosJWT);
            message.success('Thông tin khóa học đã được cập nhật thành công!');
            setIsModalVisible(false); // Ẩn modal
            const updatedCourse = await getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
            setCurrentCourseList(updatedCourse);
        } catch (error) {
            console.error('Cập nhật khóa học thất bại:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsModalVisible(false);
        getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
    };

    // Ant Design Table columns configuration
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: any, record: any, index: number) => index + 1, // Sequential numbering
            width: '5%',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
        },
        {
            title: 'Video Id',
            dataIndex: 'videoId',
            key: 'videoId',
            width: '25%',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
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
                        Edit
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
                        Delete
                    </Button>
                </>
            ),
            width: '20%',
        },
    ];

    return (
        <div className="home-container pl-[40px] pr-[50px]">
            {/* Search Section */}
            <Input.Group compact style={{ marginBottom: '20px', borderRadius: '20px' }}>
                <Select defaultValue="name" onChange={setSearchField} style={{ width: '10%', borderRadius: '20px' }}>
                    <Select.Option value="name">Tên</Select.Option>
                    <Select.Option value="videoId">Video Id</Select.Option>
                    <Select.Option value="price">Giá</Select.Option>
                </Select>
                <Input.Search
                    placeholder="Tìm kiếm"
                    onChange={(e) => setSearchText(e.target.value)}
                    enterButton
                    style={{ width: '90%', borderRadius: '20px' }}
                />
            </Input.Group>

            {/* Ant Design Table */}
            <Table
                columns={columns}
                dataSource={Array.isArray(currentCourseList) ? currentCourseList : []} // Ensure the data is an array
                rowKey={(record) => record._id}
                pagination={{ pageSize: 10 }}
            />

            {/* Modal for Editing */}
            <Modal
                title="Chỉnh sửa khóa học"
                visible={isModalVisible}
                onOk={handleSaveEdit}
                onCancel={handleCancelEdit}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên khóa học" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả khóa học" name="des">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ảnh đại diện khóa học" name="image">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Video ID" name="videoId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Giá" name="price">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CourseList;
