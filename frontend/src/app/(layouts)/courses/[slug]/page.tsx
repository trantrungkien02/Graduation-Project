'use client';
import { useEffect, useState } from 'react';
import {
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
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

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

    return (
        <div className="flex pr-[80px] pl-[40px] pt-[30px]">
            <div className="w-2/3 px-3">
                <h1 className="course-name">{course.name}</h1>
                <p className="course-des">{course.des}</p>
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
                    <button className="register-button" onClick={() => handleCourseClick(course.slug, course._id)}>
                        Đăng ký học
                    </button>
                    <ul className="course-details">
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
