'use client';
import { useEffect, useState } from 'react';
import { Button, Input, Select, Modal, Form, message, Table, Upload, Image } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import './index.scss';
import {
    deleteCourse,
    getAllCoursesByIdUser,
    searchCourses,
    updateCourse,
    getCourseById,
    getLessonBycourseId,
} from '~/redux/stateglobal/apiRequest';
import { UploadOutlined } from '@ant-design/icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactQuill from 'react-quill';
import { editIsAds, getCoursesAdsSuccess } from '~/redux/stateglobal/courseSlice';
import { faSmileWink } from '@fortawesome/free-regular-svg-icons';

interface Banner {
    endDate: Date;
}
const CourseListById = ({ uploadImage }: { uploadImage: (file: File) => Promise<any> }) => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const isAds = useSelector((state: any) => state.course.courses?.isAds);
    const courseList = useSelector((state: any) => state.course.courses?.allCoursesById ?? []);
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
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [currentCourseList, setCurrentCourseList] = useState(courseList);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrlEdit, setImageUrlEdit] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false); // State để theo dõi quá trình tải ảnh
    const [banners, setBanners] = useState<any[]>([]);
    const [requireValue, setRequireValue] = useState('<ul><li>ok</li><li>ok</li></ul>');
    const [resultValue, setResultValue] = useState('');
    const [desValue, setDesValue] = useState('');
    const [tittleValue, setTittleValue] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
        }
        const fetchBanners = async () => {
            try {
                const response = await axiosJWT.get('http://localhost:8000/v1/banner/getallbanner');
                setBanners(response.data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };
        fetchBanners();
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

    const handleDelete = (course: any) => {
        if (course.registrations > 0) {
            message.success('Không thể xóa khóa học đã có học viên');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa khóa học',
            content: 'Bạn có chắc chắn muốn xóa khóa học này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                await deleteCourse(user?.accessToken, dispatch, course._id, axiosJWT);
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
        setRequireValue(courseData.require);
        console.log(courseData);
        form.setFieldsValue({
            ...courseData,
            tittle: courseData.tittle, // HTML được trả về từ API
            require: courseData.require,
            result: courseData.result,
            des: courseData.des,
        }); // Đặt giá trị form với dữ liệu từ API
        console.log(form);
        setIsModalVisible(true); // Hiển thị modal
    };

    const handleSaveEdit = async () => {
        try {
            const values = form.getFieldsValue(); // Lấy giá trị từ form
            if (imageFile) {
                // Nếu người dùng upload ảnh mới, gửi ảnh lên server
                const uploadResponse = await uploadImage(imageFile); // Truyền imageFile trực tiếp
                values.image = uploadResponse.secure_url; // Lưu URL ảnh mới từ Cloudinary
            }
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
        setImageUrlEdit('');
        getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
        form.resetFields();
    };

    const handleViewStudents = async (courseId: string) => {
        const resEdit = await axiosJWT.get(`http://localhost:8000/v1/course/getcoursebyid/` + courseId, {
            headers: { token: `Bearer ${user?.accessToken}` },
        });
        setEditingCourse(resEdit.data);

        const res = await axiosJWT.get(`http://localhost:8000/v1/lesson/getlessonsbycourseid/` + courseId, {
            headers: { token: `Bearer ${user?.accessToken}` },
        });
        console.log(res.data.length || 0);
        if (res.data.message === 'Không tìm thấy bài học nào cho khóa học này.') {
            message.error('Khóa học của bạn chưa đăng bài giảng nào.');
            return;
        }
        if (Array.isArray(courseList)) {
            const course = courseList.find((c: any) => c._id === courseId);
            if (course) {
                const updatedRegisteredUsers = course.registeredUsers.map((user: any) => ({
                    ...user,
                    courseLength: res.data.length,
                }));
                setStudentList(updatedRegisteredUsers);
            }
        } else {
            console.error('courseList is not an array:', courseList);
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

        form1.setFieldsValue({ courseId: res?.slug }); // Gán trước courseId (ẩn trong form)
    };
    const handleCreateAds = async (courseData: any) => {
        const response = await axiosJWT.get('http://localhost:8000/v1/banner/getallbanner');
        console.log(response.data.length);
        if (response.data.length <= 10) {
            if (isAds === false) {
                dispatch(editIsAds());
            }
            dispatch(getCoursesAdsSuccess(courseData));
            router.push('/payment');
        } else {
            message.error('Số lượng quảng cáo đã vượt quá giới hạn. Vui lòng thử lại sau!');
        }
    };
    const handleCancelCn = () => {
        setIsModalVisibleCn(false);
        getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
        form1.resetFields(); // Xóa dữ liệu trong form
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
                form1.resetFields(); // Reset form sau khi gửi thành công
                getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
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
            width: '15%',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text: any, record: any) => {
                // Kiểm tra xem khóa học có trong danh sách banner hay không
                const banner = banners.find((b: any) => b.courseSlug === record.slug);
                const now = new Date();
                const remainingTime = banner && new Date(banner.endDate).getTime() - now.getTime();

                return (
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
                            onClick={() => handleDelete(record)}
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

                        {/* Check if course is public */}
                        {record.isPublic ? (
                            <>
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
                                {banner && remainingTime > 0 ? (
                                    <Button
                                        style={{
                                            backgroundColor: '#15919B',
                                            borderColor: '#15919B',
                                            borderRadius: '5px',
                                            color: 'white',
                                            marginLeft: '20px',
                                        }}
                                        disabled
                                    >
                                        Quảng cáo còn {Math.ceil(remainingTime / (1000 * 60 * 60 * 24))} ngày
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleCreateAds(record)}
                                        style={{
                                            backgroundColor: '#0b3a82',
                                            borderColor: '#0b3a82',
                                            borderRadius: '5px',
                                            color: 'white',
                                            marginLeft: '20px',
                                        }}
                                    >
                                        Quảng cáo khóa học
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                disabled
                                style={{
                                    backgroundColor: '#d3d3d3',
                                    borderColor: '#d3d3d3',
                                    borderRadius: '5px',
                                    color: '#a0a0a0',
                                    marginLeft: '20px',
                                }}
                            >
                                Chờ duyệt
                            </Button>
                        )}
                    </>
                );
            },
            width: '45%',
        },
    ];

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }], // Các cấp tiêu đề
            ['bold', 'italic', 'underline', 'strike'], // Định dạng chữ
            [{ color: [] }, { background: [] }], // Màu chữ, màu nền
            [{ script: 'sub' }, { script: 'super' }], // Chỉ số dưới, chỉ số trên
            ['blockquote', 'code-block'], // Trích dẫn, khối mã
            [{ list: 'ordered' }, { list: 'bullet' }], // Danh sách
            [{ indent: '-1' }, { indent: '+1' }], // Thụt lề
            [{ align: [] }], // Căn chỉnh
            ['link', 'image', 'video'], // Liên kết, hình ảnh, video
            ['clean'], // Xóa định dạng
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'color',
        'background',
        'script',
        'blockquote',
        'code-block',
        'list',
        'bullet',
        'indent',
        'align',
        'link',
        'image',
        'video',
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
                width={900}
                centered
                className="manage-course"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên khóa học" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tiêu đề khóa học"
                        name="tittle"
                        rules={[{ required: true, message: 'Tiêu đề khóa học không được để trống!' }]}
                    >
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={form.getFieldValue('tittle')} // Hiển thị nội dung HTML từ API
                            placeholder="Nhập tiêu đề khóa học"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Yêu cầu của khóa học"
                        name="require"
                        rules={[{ required: true, message: 'Yêu cầu của khóa học không được để trống!' }]}
                    >
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={form.getFieldValue('require')} // Hiển thị nội dung HTML từ API
                            onChange={(value) => form.setFieldsValue({ require: value })}
                            placeholder="Nhập yêu cầu của khóa học"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Kết quả của khóa học"
                        name="result"
                        rules={[{ required: true, message: 'Kết quả của khóa học không được để trống!' }]}
                    >
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={form.getFieldValue('result')} // Hiển thị nội dung HTML từ API
                            onChange={(value) => form.setFieldsValue({ result: value })}
                            placeholder="Nhập kết quả của khóa học"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="des"
                        rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
                    >
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            value={form.getFieldValue('des')} // Hiển thị nội dung HTML từ API
                            onChange={(value) => form.setFieldsValue({ des: value })}
                            placeholder="Nhập mô tả cho khóa học"
                        />
                    </Form.Item>
                    <Form.Item label="Ảnh đại diện khóa học">
                        <Image
                            src={imageUrlEdit || form.getFieldValue('image')}
                            alt="Ảnh đại diện khóa học"
                            style={{
                                marginBottom: 10,
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                        <Upload
                            beforeUpload={async (file) => {
                                setImageFile(file); // Lưu ảnh vào state
                                setIsUploading(true); // Set trạng thái đang upload
                                const res = await uploadImage(file);
                                setImageUrlEdit(res.secure_url); // Lưu URL của ảnh mới
                                setIsUploading(false); // Đặt lại trạng thái khi hoàn thành upload
                                return false; // Ngăn upload tự động
                            }}
                            maxCount={1}
                        >
                            <Button
                                icon={
                                    isUploading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            className="text-[20px]  text-[#1890ff] mr-1 motion-preset-spin "
                                        />
                                    ) : (
                                        <UploadOutlined />
                                    )
                                }
                            >
                                {isUploading ? 'Đang tải lên...' : 'Tải lên ảnh mới'}
                            </Button>
                        </Upload>
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
                title={
                    <div>
                        <h5>Danh sách học viên của khóa học "{editingCourse?.name}"</h5>
                    </div>
                }
                visible={isModalVisibleSl}
                onCancel={handleCloseModal}
                footer={null}
                width={1200}
                centered
            >
                <p className="font-bold text-[16px] mb-[10px]">Tổng số học viên: {studentList.length} Học viên</p>
                <Table
                    dataSource={[...studentList]}
                    columns={[
                        {
                            title: 'Tên học viên',
                            dataIndex: 'name',
                            key: 'name',
                            sorter: (a, b) => a.name.localeCompare(b.name), // Sắp xếp A-Z, Z-A
                            sortDirections: ['ascend', 'descend'], // Chỉ định thứ tự sắp xếp
                        },
                        {
                            title: 'Email',
                            dataIndex: 'email',
                            key: 'email',
                        },
                        {
                            title: 'Tiến độ',
                            dataIndex: 'lessonCompleted',
                            key: 'progress',
                            sorter: (a, b) => a.lessonCompleted - b.lessonCompleted, // Sắp xếp theo tiến độ
                            sortDirections: ['ascend', 'descend'],
                            render: (lessonCompleted, record) => {
                                return `${lessonCompleted} / ${record.courseLength} Bài học`; // Hiển thị tiến độ
                            },
                        },
                        {
                            title: 'Ngày đăng ký',
                            dataIndex: 'registeredAt',
                            key: 'registeredAt',
                            sorter: (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime(), // Sắp xếp theo thời gian đăng ký
                            sortDirections: ['ascend', 'descend'],
                            render: (text: string) => new Date(text).toLocaleString(),
                        },
                    ]}
                    rowKey="userId"
                    pagination={{
                        pageSizeOptions: ['5', '10', '15'], // Các tùy chọn số lượng hiển thị
                        showSizeChanger: true, // Hiển thị lựa chọn số lượng hiển thị
                        defaultPageSize: 10, // Số lượng mặc định trên mỗi trang
                    }}
                    scroll={{ y: 600 }}
                    locale={{
                        triggerDesc: 'Nhấp để sắp xếp giảm dần',
                        triggerAsc: 'Nhấp để sắp xếp tăng dần',
                        cancelSort: 'Hủy sắp xếp',
                    }}
                />
            </Modal>

            <Modal title="Tạo thông báo" visible={isModalVisibleCn} onCancel={handleCancelCn} footer={null}>
                <Form form={form1} onFinish={handleSubmitCn} layout="vertical">
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
