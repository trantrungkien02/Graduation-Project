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
    getLessonBycourseId,
} from '~/redux/stateglobal/apiRequest';

const CourseListById = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCoursesById ?? []); // Ensure it's an array
    const lessonList = useSelector((state: any) => state.lesson.lesson?.allLessonsById ?? []);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('name');
    const [editingCourse, setEditingCourse] = useState<any>(null); // Trạng thái đang edit
    const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
    const [isModalVisibleSl, setIsModalVisibleSl] = useState(false);
    const [isModalVisibleCn, setIsModalVisibleCn] = useState(false);
    const [studentList, setStudentList] = useState<any[]>([]);
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
                const res = await searchCourses(
                    user?.accessToken,
                    dispatch,
                    axiosJWT,
                    searchField,
                    searchText,
                    user?._id,
                );
                setCurrentCourseList(res);
            } else {
                const res = await getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
                setCurrentCourseList(res);
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

    const handleViewStudents = async (courseId: string) => {
        const res = await axiosJWT.get(`http://localhost:8000/v1/lesson/getlessonsbycourseid/` + courseId, {
            headers: { token: `Bearer ${user?.accessToken}` },
        });
        console.log(res.data.length || 0);
        const course = courseList.find((c: any) => c._id === courseId);
        if (course) {
            // Tạo bản sao của registeredUsers để không thay đổi trực tiếp đối tượng gốc
            const updatedRegisteredUsers = course.registeredUsers.map((user: any) => {
                return {
                    ...user, // Giữ nguyên các thuộc tính của user
                    courseLength: res.data.length, // Thêm thuộc tính courseLength
                };
            });

            // Cập nhật lại studentList với mảng đã được chỉnh sửa
            setStudentList(updatedRegisteredUsers);
        }
        setIsModalVisibleSl(true);
    };

    const handleCloseModal = () => {
        setIsModalVisibleSl(false);
        setStudentList([]);
    };
    const handleCreateNotifyForStudent = async (courseId: any) => {
        setIsModalVisibleCn(true);
        const res = await getCourseById(user?.accessToken, courseId, dispatch, axiosJWT);
        console.log(res);

        form.setFieldsValue({ courseId: res?.slug }); // Gán trước courseId (ẩn trong form)
    };

    const handleCancelCn = () => {
        setIsModalVisibleCn(false);
        form.resetFields(); // Xóa dữ liệu trong form
    };

    const handleSubmitCn = async (values: any) => {
        try {
            // API gửi thông báo
            console.log(values);
            const notifyData = { ...values, userId: user?._id, userName: user?.username };
            console.log(notifyData);
            const response = await axiosJWT.post('http://localhost:8000/v1/notify/createforcourse', notifyData);

            if (response.data) {
                message.success('Thông báo đã được gửi thành công!');
                setIsModalVisibleCn(false);
                form.resetFields(); // Reset form sau khi gửi thành công
            } else {
                message.error('Gửi thông báo thất bại!');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
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
            width: '25%',
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
                    <Button
                        onClick={() => handleViewStudents(record._id)}
                        style={{
                            backgroundColor: '#0b3a82',
                            borderColor: '#0b3a82',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '20px',
                        }}
                    >
                        Xem ds học viên
                    </Button>
                    <Button
                        onClick={() => handleCreateNotifyForStudent(record._id)}
                        style={{
                            backgroundColor: '#0b3a82',
                            borderColor: '#0b3a82',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '20px',
                        }}
                    >
                        Tạo thông báo
                    </Button>
                </>
            ),
            width: '30%',
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
            <Modal
                title="Danh sách học viên"
                visible={isModalVisibleSl}
                onCancel={handleCloseModal}
                footer={null}
                width={1200}
                centered
            >
                <Table
                    dataSource={studentList}
                    columns={[
                        {
                            title: 'Tên học viên',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email',
                        },
                        {
                            title: 'Tiến độ',
                            dataIndex: 'lessonCompleted', // Lấy 'lessonCompleted' làm dữ liệu hiển thị
                            key: 'progress',
                            render: (lessonCompleted, record) => {
                                return `${lessonCompleted} / ${record.courseLength} Bài học`; // Hiển thị 'lessonCompleted / courseLength'
                            },
                        },
                        {
                            title: 'Ngày đăng ký',
                            dataIndex: 'registeredAt',
                            key: 'registeredAt',
                            render: (text: string) => new Date(text).toLocaleString(),
                        },
                    ]}
                    rowKey="userId"
                />
            </Modal>
            <Modal title="Tạo thông báo" visible={isModalVisibleCn} onCancel={handleCancelCn} footer={null}>
                <Form form={form} onFinish={handleSubmitCn} layout="vertical">
                    {/* Ẩn courseId */}
                    <Form.Item name="courseId" hidden>
                        <Input />
                    </Form.Item>

                    {/* Tiêu đề */}
                    <Form.Item
                        name="tittle"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông báo!' }]}
                    >
                        <Input placeholder="Nhập tiêu đề thông báo" />
                    </Form.Item>

                    {/* Nội dung */}
                    <Form.Item
                        name="des"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo!' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập nội dung thông báo" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>
                        Gửi thông báo
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default CourseListById;
