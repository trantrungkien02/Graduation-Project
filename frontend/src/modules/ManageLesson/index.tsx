'use client';
import { useEffect, useState } from 'react';
import { Button, Input, Select, Modal, Form, message, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import './index.scss';
import {
    deleteCourse,
    getAllCoursesByIdUser,
    getLessonBycourseId,
    updateLesson, // Update lesson API instead of course
    registerLesson,
    getLessonById,
    deleteLesson,
} from '~/redux/stateglobal/apiRequest';

const LessonList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCoursesById ?? []);
    const lessonList = useSelector((state: any) => state.lesson.lesson?.allLessonsById ?? []); // Always ensure array
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('name');
    const [editingLesson, setEditingLesson] = useState<any>(null); // Changed from course to lesson
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null); // State to store selected course ID
    const [currentLessonList, setCurrentLessonList] = useState(lessonList); // Store current lessons

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
        }
    }, []);

    const handleCourseSelect = async (courseId: string) => {
        setSelectedCourseId(courseId);
        const lessons = await getLessonBycourseId(user?.accessToken, courseId, dispatch, axiosJWT);
        setCurrentLessonList(lessons); // Update the current lessons state
    };

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: 'Xác nhận xóa bài giảng',
            content: 'Bạn có chắc chắn muốn xóa bài giảng này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                await deleteLesson(user?.accessToken, dispatch, id, axiosJWT); // Assuming this is the delete lesson API
                if (selectedCourseId) {
                    const updatedLessons = await getLessonBycourseId(
                        user?.accessToken,
                        selectedCourseId,
                        dispatch,
                        axiosJWT,
                    );
                    setCurrentLessonList(updatedLessons); // Update current lessons
                }
            },
        });
    };

    const handleEdit = async (lessonId: string) => {
        const lessonData = await getLessonById(user?.accessToken, lessonId, dispatch, axiosJWT);
        console.log(lessonList);
        setEditingLesson(lessonData); // Editing lesson, not course
        form.setFieldsValue(lessonData);
        setIsModalVisible(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedCourseId) {
            message.error('Vui lòng chọn một khóa học trước khi thêm bài giảng!');
            return;
        }
        try {
            const values = form.getFieldsValue();
            await updateLesson(user?.accessToken, dispatch, { ...editingLesson, ...values }, axiosJWT); // Update lesson API
            message.success('Thông tin bài giảng đã được cập nhật thành công!');
            setIsModalVisible(false);
            const updatedLessons = await getLessonBycourseId(user?.accessToken, selectedCourseId, dispatch, axiosJWT);
            setCurrentLessonList(updatedLessons);
        } catch (error) {
            console.error('Cập nhật bài giảng thất bại:', error);
        }
    };

    const handleCancelEdit = () => {
        setIsModalVisible(false);
    };

    // Function to handle adding a new lesson
    const handleAddLesson = async (values: any) => {
        if (!selectedCourseId) {
            message.error('Vui lòng chọn một khóa học trước khi thêm bài giảng!');
            return;
        }
        try {
            const lessonData = { ...values, courseId: selectedCourseId };
            const resultLesson = await registerLesson(lessonData, dispatch);
            if (resultLesson === 'Lesson name and courseId combination already exists') {
                message.success('Bài giảng đã tồn tại!');
            } else {
                message.success('Bài giảng đã được thêm thành công!');
            }
            setIsAddModalVisible(false);
            const updatedLessons = await getLessonBycourseId(user?.accessToken, selectedCourseId, dispatch, axiosJWT);
            setCurrentLessonList(updatedLessons); // Update current lessons
        } catch (error) {
            console.error('Thêm bài giảng thất bại:', error);
        }
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
            title: 'Tên bài giảng',
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
            title: 'Thảo luận',
            dataIndex: 'discuss',
            key: 'discuss',
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
            <h2 className="manage-title">Quản lý bài giảng</h2>
            <Input.Group compact style={{ marginBottom: '20px', borderRadius: '20px' }}>
                <Select
                    placeholder="Chọn khóa học"
                    onChange={(courseId) => handleCourseSelect(courseId)}
                    style={{ width: '90%', borderRadius: '20px' }}
                >
                    {courseList.map((course: any) => (
                        <Select.Option key={course._id} value={course._id}>
                            {course.name}
                        </Select.Option>
                    ))}
                </Select>
            </Input.Group>

            {/* Ant Design Table for Lessons */}
            <Table
                columns={columns}
                dataSource={Array.isArray(currentLessonList) && selectedCourseId ? currentLessonList : []}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 10 }}
            />

            {/* Button to add a new lesson - only visible when a course is selected */}
            {selectedCourseId && (
                <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: '20px' }}>
                    Thêm bài giảng
                </Button>
            )}

            {/* Modal for Adding a Lesson */}
            <Modal
                title="Thêm bài giảng"
                visible={isAddModalVisible}
                onOk={() => {
                    form.validateFields()
                        .then(handleAddLesson)
                        .catch((info) => console.log('Validate Failed:', info));
                }}
                onCancel={() => setIsAddModalVisible(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên bài giảng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên bài giảng!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Video ID"
                        name="videoId"
                        rules={[{ required: true, message: 'Vui lòng nhập Video ID!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Thảo luận"
                        name="discuss"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung thảo luận!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal for Editing */}
            <Modal
                title="Chỉnh sửa bài giảng"
                visible={isModalVisible}
                onOk={handleSaveEdit}
                onCancel={handleCancelEdit}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên bài giảng" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Video ID" name="videoId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Thảo luận" name="discuss">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LessonList;
