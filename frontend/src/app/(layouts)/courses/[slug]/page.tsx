'use client';
import { useEffect, useState } from 'react';
import { fetchCourseBySlug, getLessonBycourseId, registerCourseForUser } from '~/redux/stateglobal/apiRequest';
import './page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faFilm, faClock, faBatteryFull, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface CourseDetailPageProps {
    params: { slug: string }; // Nhận giá trị slug từ URL
}

// Utility to convert HH:MM:SS or MM:SS to total seconds
const convertToSeconds = (timeStr: any) => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
};

// Utility to convert total seconds back to HH:MM:SS format
const convertToHHMMSS = (totalSeconds: any) => {
    const hours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]); // State to store lessons
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [totalDuration, setTotalDuration] = useState('00:00:00');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseData = await fetchCourseBySlug(params.slug);
                setCourse(courseData);

                const lessonsData = await getLessonBycourseId(user?.accessToken, courseData._id, dispatch, axiosJWT);
                setLessons(lessonsData);

                // Calculate the total duration
                const totalDurationSeconds = lessonsData.reduce((acc: any, lesson: any) => {
                    if (!lesson.duration) return acc;

                    const timeParts = lesson.duration.split(':').map(Number);
                    const seconds =
                        timeParts.length === 3
                            ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2] // HH:MM:SS
                            : timeParts[0] * 60 + timeParts[1]; // MM:SS

                    return acc + seconds;
                }, 0);

                // Convert total duration from seconds to HH:MM:SS
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
        return <div>Loading...</div>;
    }

    const handleCourseClick = async (slug: string, courseId: string) => {
        try {
            // Call the backend to increment the registration count
            await registerCourseForUser(user?.accessToken, user?._id, dispatch, courseId, axiosJWT);

            // Navigate to the course learning page
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
                {/* Hiển thị tên các bài giảng */}
                <ul className="lesson-list">
                    {lessons.map((lesson, index) => (
                        <li key={lesson._id} className="lesson-item">
                            <div className="">
                                <FontAwesomeIcon icon={faCirclePlay} className="mr-3 text-[18px] text-[#1261a6]" />
                                <span className="lesson-number">Bài {index + 1}.</span>
                                <span className="text-[16px]">{lesson.name}</span>
                            </div>
                            <span className="text-[16px] text-[#1261a6]">{lesson.duration || '00:00:00'}</span>
                        </li>
                    ))}
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
                    {/* Course Pricing */}
                    <h2 className="course-pricing">{course.price === 'Miễn phí' ? 'Miễn phí' : `${course.price} đ`}</h2>

                    {/* Register Button */}
                    <button className="register-button" onClick={() => handleCourseClick(course.slug, course._id)}>
                        Đăng ký học
                    </button>

                    {/* Course Details */}
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
