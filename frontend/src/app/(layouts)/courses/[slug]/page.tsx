'use client';
import { useEffect, useState } from 'react';
import { fetchCourseBySlug, getLessonBycourseId, registerCourseForUser } from '~/redux/stateglobal/apiRequest';
import './page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faFilm, faClock, faBatteryFull } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface CourseDetailPageProps {
    params: { slug: string }; // Nhận giá trị slug từ URL
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]); // State to store lessons
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        // Gọi hàm fetchCourseBySlug để lấy dữ liệu khóa học
        const fetchData = async () => {
            try {
                const courseData = await fetchCourseBySlug(params.slug);
                setCourse(courseData); // Lưu dữ liệu vào state

                // Gọi hàm getLessonBycourseId để lấy dữ liệu bài giảng
                const lessonsData = await getLessonBycourseId(user?.accessToken, courseData._id, dispatch, axiosJWT);
                setLessons(lessonsData); // Lưu dữ liệu bài giảng vào state
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

                {/* Hiển thị tên các bài giảng */}
                <ul className="lesson-list">
                    {lessons.map((lesson, index) => (
                        <li key={lesson._id} className="lesson-item">
                            <span className="lesson-number">{index + 1}. </span>
                            {lesson.name}
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
                            <span>Tổng số {lessons.length || 0} bài học</span>
                        </li>
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-3 text-[18px] text-[#000]" />
                            <span>Thời lượng {course.duration || '03 giờ 26 phút'}</span>
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
