'use client';
import { useEffect, useState } from 'react';
import {
    approveCourse,
    createNotify,
    deleteCourse,
    deleteLesson,
    fetchCourseBySlug,
    getCourseById,
    getLessonBycourseId,
    registerCourseForUser,
    updateCourseAddUser,
} from '~/redux/stateglobal/apiRequest';
import './index.scss';
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
import { Form, Input, message, Modal } from 'antd';
import PaymentFormModal from '~/modules/PaymentForBuyCourse';
import { editIsAds, getCoursesOrderSuccess } from '~/redux/stateglobal/courseSlice';
import DOMPurify from 'dompurify';
import sanitizeCourse from '~/modules/FunctionHandle/sanitizeCourse';
import Footer from '../Footer';
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
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}
export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const isAds = useSelector((state: any) => state.course.courses?.isAds);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleRs, setIsModalVisibleRs] = useState(false);
    const [isModalOpenLs, setIsModalOpenLs] = useState(false);
    const [isModalVisibleLs, setIsModalVisibleLs] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [player, setPlayer] = useState<any>(null);

    const handleLessonClick = (lesson: any) => {
        setCurrentLesson(lesson);
        if (user?.role === '3') {
            setIsModalOpenLs(true);
        } else {
            message.error('Bạn không có quyền truy cập bài giảng này khi chưa đăng ký khóa học!');
        }
    };

    const closeModal = () => {
        setIsModalOpenLs(false);
        setCurrentLesson(null);
    };
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

    useEffect(() => {
        if (currentLesson) {
            // Load YouTube Iframe API if not already loaded
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

                // Initialize the player once the API is ready
                window.onYouTubeIframeAPIReady = initializePlayer;
            } else {
                initializePlayer();
            }
        }
    }, [currentLesson]); // Ensure this runs each time currentLesson changes

    const initializePlayer = () => {
        if (!currentLesson) return;

        // If player exists, destroy it before creating a new one
        if (player) {
            player.destroy();
        }

        const newPlayer = new window.YT.Player('video-player', {
            videoId: currentLesson.videoId,
            events: {
                onStateChange: onPlayerStateChange,
            },
        });
        setPlayer(newPlayer); // Update the player state to hold the new player instance
    };

    const onPlayerStateChange = async (event: any) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            // Đánh dấu video đã kết thúc
        }
    };
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
        if (isAds === true) {
            dispatch(editIsAds());
        }
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
    const handleRefuseClickLs = () => {
        setIsModalVisibleLs(true);
        console.log(course);
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
            courseId: course._id,
        };

        // Gửi thông báo
        await createNotify(notifyData, axiosJWT);
        await deleteCourse(user?.accessToken, dispatch, courseData?._id, axiosJWT);

        // Chuyển hướng sau khi xử lý xong
        router.push('/system');

        // Đóng modal
        setIsModalVisibleRs(false);
    };
    const handleRefuseApproveLesson = async (lessonData: any, formData: { tittle: string; des: string }) => {
        const notifyData = {
            senderId: user?._id,
            senderName: 'Admin',
            receiverId: course.userId,
            tittle: formData.tittle, // Lấy từ form
            type: 'system',
            des: formData.des, // Lấy từ form
            lessonId: lessonData._id,
            courseId: course._id,
        };

        // Gửi thông báo
        await createNotify(notifyData, axiosJWT);
        await deleteLesson(user?.accessToken, dispatch, lessonData?._id, axiosJWT);

        // Đóng modal
        setIsModalOpenLs(false);
        setIsModalVisibleLs(false);
        const lessonsNewData = await getLessonBycourseId(user?.accessToken, course._id, dispatch, axiosJWT);
        setLessons(lessonsNewData);
    };
    // Hàm xử lý khi hủy phê duyệt
    const handleCancel = () => {
        setIsModalVisible(false); // Đóng modal nếu người dùng hủy
    };
    const handleCancelRs = () => {
        setIsModalVisibleRs(false); // Đóng modal nếu người dùng hủy
    };
    const handleCancelLs = () => {
        setIsModalVisibleLs(false); // Đóng modal nếu người dùng hủy
    };
    const sanitizedCourse = sanitizeCourse(course);

    return (
        <div className="flex pr-[80px] pl-[40px] pt-[30px]">
            <div className="w-2/3 px-3 course-des">
                <h1 className="course-name">{course?.name}</h1>
                <p dangerouslySetInnerHTML={{ __html: sanitizedCourse?.tittle }} />
                <h5 className="my-4">Bạn sẽ học được gì sau khóa học ?</h5>
                <p dangerouslySetInnerHTML={{ __html: sanitizedCourse?.result }} />
                <div className="detail-course">Nội dung khóa học</div>
                <div className="flex my-3">
                    <div className="flex items-center">
                        <span>
                            <span className="font-semibold">{lessons.length || 0}</span> bài học
                        </span>
                    </div>
                    <div className="flex items-center ml-4">
                        <span>
                            Thời lượng <span className="font-semibold ">{course?.totalDuration || '00:00:00'}</span>
                        </span>
                    </div>
                </div>
                <ul className="lesson-list-course">
                    {lessons?.length > 0 ? (
                        lessons.map((lesson, index) => (
                            <li
                                key={lesson._id}
                                className="lesson-item"
                                onClick={() => handleLessonClick(lesson)}
                                style={{
                                    cursor: 'pointer',
                                    border: user?.role === '3' ? '1px solid transparent' : undefined,
                                }}
                                onMouseEnter={(e) => {
                                    if (user?.role === '3')
                                        e.currentTarget.style.boxShadow = '0px 4px 4px rgba(18, 97, 166, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    if (user?.role === '3') e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
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
                    <Modal
                        title={`Bài giảng ${currentLesson?.name}`}
                        open={isModalOpenLs}
                        onCancel={closeModal}
                        footer={null}
                        width={800}
                    >
                        {currentLesson ? (
                            <div>
                                <div id="video-player" className="w-full"></div>
                                <button className="register-button ml-3 !bg-red-600" onClick={handleRefuseClickLs}>
                                    Từ chối
                                </button>
                                <Modal
                                    title="Xác nhận từ chối phê duyệt bài học"
                                    visible={isModalVisibleLs}
                                    onOk={() => {
                                        form.validateFields()
                                            .then((values) => {
                                                form.resetFields();
                                                handleRefuseApproveLesson(currentLesson, values); // Truyền `tittle` và `des` cho bài học
                                                setIsModalVisibleLs(false);
                                            })
                                            .catch((info) => {
                                                console.log('Validate Failed:', info);
                                            });
                                    }}
                                    onCancel={handleCancelLs}
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
                        ) : (
                            <p>Không tìm thấy video</p>
                        )}
                    </Modal>
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
                    {user?.role === '3' ? (
                        <div className="flex">
                            {course?.isPublic === false ? (
                                <div className="flex">
                                    <button className="register-button" onClick={handleApproveClick}>
                                        Phê duyệt
                                    </button>
                                    <button className="register-button ml-3 !bg-red-600" onClick={handleRefuseClick}>
                                        Từ chối
                                    </button>
                                </div>
                            ) : (
                                <button className="register-button ml-3 !bg-red-600" onClick={handleRefuseClick}>
                                    Từ chối
                                </button>
                            )}
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
