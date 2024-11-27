'use client';
import { useEffect, useState } from 'react';
import {
    approveCourse,
    createNotify,
    deleteCourse,
    fetchCourseBySlug,
    getCourseById,
    getLessonBycourseId,
    registerCourseForUser,
    updateCourseAddUser,
} from '~/redux/stateglobal/apiRequest';
import './page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGaugeHigh,
    faFilm,
    faClock,
    faBatteryFull,
    faCirclePlay,
    faSpinner,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { Form, Input, Modal } from 'antd';
import PaymentFormModal from '~/modules/PaymentFormModal';
import { getCoursesOrderSuccess } from '~/redux/stateglobal/courseSlice';
import DOMPurify from 'dompurify';
import sanitizeCourse from '~/modules/FunctionHandle/sanitizeCourse';
interface CourseDetailPageProps {
    params: { slug: string };
}

interface Lesson {
    _id: string;
    name: string;
    videoId: string;
    duration: string;
    createdAt?: string;
    locked?: boolean;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleRs, setIsModalVisibleRs] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseData = await fetchCourseBySlug(params.slug);
                setCourse(courseData);

                const lessonsData = await getLessonBycourseId(user?.accessToken, courseData._id, dispatch, axiosJWT);
                setLessons(lessonsData);

                const totalDurationSeconds = lessonsData.reduce((acc: any, lesson: any) => {
                    if (!lesson.duration) return acc;

                    const timeParts = lesson.duration.split(':').map(Number);
                    const seconds =
                        timeParts.length === 3
                            ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
                            : timeParts[0] * 60 + timeParts[1];

                    return acc + seconds;
                }, 0);

                const hours = Math.floor(totalDurationSeconds / 3600);
                const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
                const seconds = totalDurationSeconds % 60;

                setCourse((prevCourse: any) => ({
                    ...prevCourse,
                    totalDuration: `${String(hours).padStart(2, '0')} giờ ${String(minutes).padStart(2, '0')} phút`,
                }));
            } catch (error) {
                console.error('Error fetching course or lessons data:', error);
            }
        };

        fetchData();
    }, [params.slug]);

    if (!course) {
        return (
            <div className="loading-overlay">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-[30px] mt-[5px] text-[#555] hover:text-[#0b3a82] motion-preset-spin "
                />
            </div>
        );
    }

    const handleCourseClick = async (slug: string, courseId: string) => {
        try {
            const userData = {
                userId: user?._id,
                name: user?.username,
                email: user?.email,
                registeredAt: new Date(),
            };
            console.log(userData);
            await updateCourseAddUser(user.accessToken, dispatch, courseId, userData, axiosJWT);

            const courseDetail = await getCourseById(user.accessToken, courseId, dispatch, axiosJWT);

            await registerCourseForUser(user?.accessToken, user?._id, dispatch, courseDetail, axiosJWT);

            router.push(`/learning/${slug}`);
        } catch (error) {
            console.error('Error registering course:', error);
        }
    };

    const handleBuyCourseClick = (courseData: any) => {
        dispatch(getCoursesOrderSuccess(courseData));
        router.push(`/payment`);
    };
    const handleApproveClick = () => {
        setIsModalVisible(true);
    };
    const handleConfirmApprove = async (courseData: any) => {
        const updatedCourseData = { ...courseData, isPublic: true }; // Tạo bản sao và thay đổi giá trị isPublic

        await approveCourse(user?.accessToken, dispatch, updatedCourseData, axiosJWT);
        const notifyData = {
            senderId: user?._id,
            senderName: 'Admin',
            receiverId: courseData.userId,
            tittle: `Khóa học ${courseData.name} của bạn đã được phê duyệt`,
            type: 'system',
            des: 'Admin đã xem xét khóa học của bạn.',
            lessonId: '',
            courseId: '',
        };
        await createNotify(notifyData, axiosJWT);
        router.push('/system');
        // Đóng modal sau khi phê duyệt
        setIsModalVisible(false);
    };
    const handleRefuseClick = () => {
        setIsModalVisibleRs(true);
    };
    const handleRefuseApprove = async (courseData: any, formData: { tittle: string; des: string }) => {
        const notifyData = {
            senderId: user?._id,
            senderName: 'Admin',
            receiverId: courseData.userId,
            tittle: formData.tittle, // Lấy từ form
            type: 'system',
            des: formData.des, // Lấy từ form
            lessonId: '',
            courseId: '',
        };

        // Gửi thông báo
        await createNotify(notifyData, axiosJWT);
        await deleteCourse(user?.accessToken, dispatch, courseData?._id, axiosJWT);

        // Chuyển hướng sau khi xử lý xong
        router.push('/system');

        // Đóng modal
        setIsModalVisibleRs(false);
    };

    // Hàm xử lý khi hủy phê duyệt
    const handleCancel = () => {
        setIsModalVisible(false); // Đóng modal nếu người dùng hủy
    };
    const handleCancelRs = () => {
        setIsModalVisibleRs(false); // Đóng modal nếu người dùng hủy
    };
    const sanitizedCourse = sanitizeCourse(course);

    return (
        <div className="flex pr-[80px] pl-[40px] pt-[30px]">
            <div className="w-2/3 px-3 course-des">
                <h1 className="course-name">{course.name}</h1>
                <p dangerouslySetInnerHTML={{ __html: sanitizedCourse.tittle }} />
                <h5 className="my-4">Bạn sẽ học được gì sau khóa học ?</h5>
                <p dangerouslySetInnerHTML={{ __html: sanitizedCourse.result }} />
                <div className="detail-course">Nội dung khóa học</div>
                <div className="flex my-3">
                    <div className="flex items-center">
                        <span>
                            <span className="font-semibold">{lessons.length || 0}</span> bài học
                        </span>
                    </div>
                    <div className="flex items-center ml-4">
                        <span>
                            Thời lượng <span className="font-semibold ">{course.totalDuration || '00:00:00'}</span>
                        </span>
                    </div>
                </div>
                <ul className="lesson-list">
                    {lessons?.length > 0 ? (
                        lessons.map((lesson, index) => (
                            <li key={lesson._id} className="lesson-item">
                                <div>
                                    <FontAwesomeIcon icon={faCirclePlay} className="mr-3 text-[18px] text-[#1261a6]" />
                                    <span className="lesson-number">Bài {index + 1}.</span>
                                    <span className="text-[16px]">{lesson.name}</span>
                                </div>
                                <span className="text-[16px] text-[#1261a6]">{lesson.duration || '00:00:00'}</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-[16px] text-gray-500">Khóa học này chưa có bài giảng nào</p>
                    )}
                </ul>
                <h5 className="my-4">Yêu cầu</h5>
                <p dangerouslySetInnerHTML={{ __html: sanitizedCourse.require }} />

                <h5 className="my-4">Mô tả</h5>
                <div dangerouslySetInnerHTML={{ __html: sanitizedCourse.des }} />
            </div>
            <div className="w-1/3 video-container px-3 course-detail-page">
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${course.videoId}?si=rmkb8ZZrD081mvrz`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
                <div className="course-info">
                    <h2 className="course-pricing">{course.price === 'Miễn phí' ? 'Miễn phí' : `${course.price} đ`}</h2>
                    {user?.role === '3' && course.isPublic === false ? (
                        <div className="flex">
                            <button className="register-button" onClick={handleApproveClick}>
                                Phê duyệt
                            </button>
                            <button className="register-button ml-3 !bg-red-600" onClick={handleRefuseClick}>
                                Từ chối
                            </button>
                            <Modal
                                title="Xác nhận phê duyệt"
                                visible={isModalVisible}
                                onOk={() => handleConfirmApprove(course)}
                                onCancel={handleCancel}
                                okText="Phê duyệt"
                                cancelText="Hủy"
                            >
                                <p>Bạn có chắc chắn muốn phê duyệt khóa học này?</p>
                            </Modal>
                            <Modal
                                title="Xác nhận từ chối phê duyệt"
                                visible={isModalVisibleRs}
                                onOk={() => {
                                    form.validateFields()
                                        .then((values) => {
                                            form.resetFields();
                                            handleRefuseApprove(course, values); // Truyền `tittle` và `des`
                                        })
                                        .catch((info) => {
                                            console.log('Validate Failed:', info);
                                        });
                                }}
                                onCancel={handleCancelRs}
                                okText="Từ chối"
                                cancelText="Hủy"
                            >
                                <Form form={form} layout="vertical">
                                    <Form.Item
                                        label="Tiêu đề"
                                        name="tittle"
                                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                    >
                                        <Input placeholder="Nhập tiêu đề" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Mô tả"
                                        name="des"
                                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                                    >
                                        <Input.TextArea rows={4} placeholder="Nhập mô tả" />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
                    ) : course.price === 'Miễn phí' ? (
                        <button className="register-button" onClick={() => handleCourseClick(course.slug, course._id)}>
                            Đăng ký học
                        </button>
                    ) : (
                        <button className="register-button" onClick={() => handleBuyCourseClick(course)}>
                            Mua ngay
                        </button>
                    )}
                    <ul className="course-details">
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-3 text-[18px] text-[#000]" />
                            <span>Giảng viên hướng dẫn: &nbsp;{course.userName}</span>
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faGaugeHigh} className="mr-3 text-[18px] text-[#000]" />
                            <span>Trình độ&nbsp;{course.level}</span>
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faFilm} className="mr-3 text-[18px] text-[#000]" />
                            <span>
                                Tổng số <span className="font-semibold text-[#555]">{lessons.length || 0}</span> bài học
                            </span>
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-3 text-[18px] text-[#000]" />
                            <span>
                                Thời lượng{' '}
                                <span className="font-semibold text-[#555]">{course.totalDuration || '00:00:00'}</span>
                            </span>
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faBatteryFull} className="mr-3 text-[18px] text-[#000]" />
                            <span>Học mọi lúc, mọi nơi</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
