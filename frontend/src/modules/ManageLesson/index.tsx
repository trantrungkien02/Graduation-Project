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
    registerPractice,
} from '~/redux/stateglobal/apiRequest';

interface Question {
    quesName: string;
    a: string;
    b: string;
    c: string;
    d: string;
    quesCorrect: string;
    explanation: string;
    [key: string]: string;
}
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
    const [practiceName, setPracticeName] = useState('');
    const [isModalVisiblePt, setIsModalVisiblePt] = useState(false);
    const [isEditPractice, setIsEditPractice] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        quesName: '',
        a: '',
        b: '',
        c: '',
        d: '',
        quesCorrect: '',
        explanation: '',
    });
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

        if (lessonData.type === 'video') {
            setEditingLesson(lessonData);
            form.setFieldsValue(lessonData); // Gán dữ liệu video vào form
            setIsModalVisible(true); // Hiển thị modal dành cho bài học dạng video
        } else if (lessonData.type === 'question') {
            console.log(lessonData);
            setEditingLesson(lessonData);
            setIsEditPractice(true);
            setPracticeName(lessonData.name || ''); // Gán tên bài kiểm tra trắc nghiệm (nếu có)
            setQuestions(lessonData.quesList || []); // Gán danh sách câu hỏi
            setCurrentIndex(0); // Đặt về câu hỏi đầu tiên
            setCurrentQuestion(lessonData.quesList?.[0] || {}); // Gán dữ liệu cho câu hỏi đầu tiên
            setIsModalVisiblePt(true); // Hiển thị modal dành cho câu hỏi
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedCourseId) {
            message.error('Vui lòng chọn một khóa học trước khi thêm bài giảng!');
            return;
        }
        try {
            if (editingLesson.type === 'video') {
                const values = form.getFieldsValue();
                await updateLesson(user?.accessToken, dispatch, { ...editingLesson, ...values }, axiosJWT); // Update lesson API
                message.success('Thông tin bài giảng đã được cập nhật thành công!');
                setIsModalVisible(false);
                const updatedLessons = await getLessonBycourseId(
                    user?.accessToken,
                    selectedCourseId,
                    dispatch,
                    axiosJWT,
                );
                setCurrentLessonList(updatedLessons);
            } else if (editingLesson.type === 'question') {
                const lessonPractice = {
                    _id: editingLesson._id,
                    quesList: questions,
                    name: practiceName,
                    courseId: selectedCourseId,
                    userId: user?._id,
                    userName: user?.username,
                };
                console.log(lessonPractice);
                await updateLesson(user?.accessToken, dispatch, lessonPractice, axiosJWT); // Update lesson API
                message.success('Thông tin bài kiểm tra trắc nghiệm đã được cập nhật thành công!');
                setIsModalVisiblePt(false);
                const updatedLessons = await getLessonBycourseId(
                    user?.accessToken,
                    selectedCourseId,
                    dispatch,
                    axiosJWT,
                );
                setCurrentLessonList(updatedLessons);
            }
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
            const lessonData = {
                ...values,
                courseId: selectedCourseId,
                userId: user?._id,
                userName: user?.username,
                discuss: 'hh',
            };
            const resultLesson = await registerLesson(lessonData, dispatch);
            if (resultLesson === 'Lesson name and courseId combination already exists') {
                message.success('Bài giảng đã tồn tại!');
            } else {
                message.success('Bài giảng đã được thêm thành công!');
            }
            setIsAddModalVisible(false);
            const updatedLessons = await getLessonBycourseId(user?.accessToken, selectedCourseId, dispatch, axiosJWT);
            setCurrentLessonList(updatedLessons); // Update current lessons
            form.resetFields();
        } catch (error) {
            console.error('Thêm bài giảng thất bại:', error);
        }
    };
    useEffect(() => {
        if (currentIndex >= 0 && currentIndex < questions.length) {
            setCurrentQuestion(questions[currentIndex]); // Hiển thị câu hỏi cũ
        } else {
            setCurrentQuestion({
                quesName: '',
                a: '',
                b: '',
                c: '',
                d: '',
                quesCorrect: '',
                explanation: '',
            }); // Form trống để thêm câu hỏi mới
        }
    }, [currentIndex, questions]);

    // Xử lý thêm/sửa câu hỏi
    const handleUpdateCurrentQuestion = () => {
        if (currentIndex >= 0 && currentIndex < questions.length) {
            // Cập nhật câu hỏi cũ
            const updatedQuestions = [...questions];
            updatedQuestions[currentIndex] = currentQuestion;
            setQuestions(updatedQuestions);
            message.success(` Cập nhật câu hỏi số ${currentIndex + 1} thành công`);
        } else {
            // Thêm câu hỏi mới
            setQuestions([...questions, currentQuestion]);
            setCurrentIndex(questions.length); // Di chuyển đến câu hỏi vừa thêm
            message.success(` Đã thêm thành công ${questions.length + 1} câu hỏi`);
        }
    };

    // Xử lý lưu danh sách câu hỏi
    const handleSavePractice = async () => {
        if (questions.length === 0) {
            message.error('Bạn chưa thêm câu hỏi nào!');
            return;
        }
        if (!selectedCourseId) {
            message.error('Vui lòng chọn một khóa học trước khi thêm bài giảng!');
            return;
        }
        try {
            console.log(questions);
            const lessonPractice = {
                quesList: questions,
                name: practiceName,
                courseId: selectedCourseId,
                userId: user?._id,
                userName: user?.username,
            };
            console.log(lessonPractice);
            await registerPractice(lessonPractice, dispatch);
            message.success('Thêm bài kiểm tra trắc nghiệm thành công!');
            setQuestions([]);
            setCurrentIndex(0);
            form.resetFields();
            setIsModalVisiblePt(false);
            const updatedLessons = await getLessonBycourseId(user?.accessToken, selectedCourseId, dispatch, axiosJWT);
            setCurrentLessonList(updatedLessons);
        } catch (err) {
            message.error('Có lỗi xảy ra khi thêm bài kiểm tra trắc nghiệm!');
        }
    };
    const handlePrevious = () => {
        console.log(currentIndex, questions[currentIndex]);
        setCurrentIndex((prev) => prev - 1);
    };

    // Xử lý chuyển sang câu hỏi tiếp theo
    const handleNext = () => {
        console.log(currentIndex, questions[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        console.log(currentIndex);
    };
    const resetFormState = () => {
        setPracticeName('');
        setCurrentQuestion({
            quesName: '',
            a: '',
            b: '',
            c: '',
            d: '',
            quesCorrect: '',
            explanation: '',
        });
        setCurrentIndex(0); // Nếu cần reset cả index
        setQuestions([]);
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
            title: 'Phân loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (type === 'video' ? 'Bài Giảng' : 'Bài Kiểm Tra'),
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
                    style={{ width: '100%', borderRadius: '20px' }}
                >
                    {courseList.length > 0 ? (
                        courseList.map((course: any) => (
                            <Select.Option key={course._id} value={course._id}>
                                {course.name}
                            </Select.Option>
                        ))
                    ) : (
                        <div>Bạn chưa có khóa học nào</div>
                    )}
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

            {selectedCourseId && (
                <Button
                    type="primary"
                    onClick={() => setIsModalVisiblePt(true)}
                    style={{ marginBottom: '20px', marginLeft: '20px' }}
                >
                    Thêm bài kiểm tra trắc nghiệm
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
                    {/* <Form.Item
                        label="Thảo luận"
                        name="discuss"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung thảo luận!' }]}
                    >
                        <Input />
                    </Form.Item> */}
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
                    {/* <Form.Item label="Thảo luận" name="discuss">
                        <Input />
                    </Form.Item> */}
                </Form>
            </Modal>
            <Modal
                title="Thêm bài kiểm tra trắc nghiệm"
                visible={isModalVisiblePt}
                onCancel={() => {
                    form.resetFields();
                    resetFormState();
                    setIsModalVisiblePt(false);
                    setIsEditPractice(false);
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            form.resetFields();
                            resetFormState();

                            setIsModalVisiblePt(false);
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button key="back" onClick={handlePrevious} disabled={currentIndex <= 0}>
                        Quay lại
                    </Button>,
                    <Button key="next" onClick={handleNext} disabled={currentIndex > questions.length - 1}>
                        Tiếp theo
                    </Button>,

                    <Button key="save" type="primary" onClick={handleUpdateCurrentQuestion}>
                        {currentIndex >= 0 && currentIndex < questions.length ? 'Cập nhật' : 'Thêm câu hỏi'}
                    </Button>,
                    <Button
                        key="finalSave"
                        type="primary"
                        onClick={isEditPractice ? handleSaveEdit : handleSavePractice}
                    >
                        Lưu
                    </Button>,
                ]}
                centered
            >
                <Form layout="vertical">
                    <Form.Item label="Tên bài kiểm tra trắc nghiệm">
                        <Input value={practiceName} onChange={(e) => setPracticeName(e.target.value)} />
                    </Form.Item>
                    <div className="font-bold mb-2">{`Câu hỏi số ${currentIndex + 1}`}</div>
                    <Form.Item label="Nội dung câu hỏi">
                        <Input
                            value={currentQuestion.quesName}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, quesName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Đáp án A">
                        <Input
                            value={currentQuestion.a}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, a: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Đáp án B">
                        <Input
                            value={currentQuestion.b}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, b: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Đáp án C">
                        <Input
                            value={currentQuestion.c}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, c: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Đáp án D">
                        <Input
                            value={currentQuestion.d}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, d: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Đáp án đúng">
                        <Select
                            value={currentQuestion.quesCorrect}
                            onChange={(value) => setCurrentQuestion({ ...currentQuestion, quesCorrect: value })}
                        >
                            <Select.Option value="a">A</Select.Option>
                            <Select.Option value="b">B</Select.Option>
                            <Select.Option value="c">C</Select.Option>
                            <Select.Option value="d">D</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Giải thích đáp án đúng">
                        <Input
                            value={currentQuestion.explanation}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LessonList;
