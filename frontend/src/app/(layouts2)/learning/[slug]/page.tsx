'use client';
import { useEffect, useState } from 'react';
import { fetchCourseBySlug, getLessonBycourseId } from '~/redux/stateglobal/apiRequest';
import './page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faFilm, faClock, faBatteryFull } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'; // Sử dụng useRouter để điều hướng và cập nhật URL

interface CourseDetailPageProps {
    params: { slug: string }; // Nhận giá trị slug từ URL
}
interface Lesson {
    _id: string;
    name: string;
    videoId: string;
    // Thêm các thuộc tính khác của bài giảng nếu cần
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]); // State để lưu danh sách bài giảng
    const [selectedLesson, setSelectedLesson] = useState<any>(null); // State để lưu bài giảng đã chọn
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const router = useRouter(); // Hook để điều hướng và thay đổi URL
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thông tin khóa học
                const courseData = await fetchCourseBySlug(params.slug);
                setCourse(courseData);

                // Lấy danh sách bài giảng
                const lessonsData = await getLessonBycourseId(user?.accessToken, courseData._id, dispatch, axiosJWT);
                setLessons(lessonsData);

                // Nếu URL có chứa lesson id (ví dụ: ?id=123), thì tự động chọn bài giảng đó
                const lessonIdFromUrl = new URLSearchParams(window.location.search).get('id');
                if (lessonIdFromUrl) {
                    const foundLesson = lessonsData.find((lesson: Lesson) => lesson._id === lessonIdFromUrl);
                    setSelectedLesson(foundLesson || lessonsData[0]);
                } else {
                    setSelectedLesson(lessonsData[0]); // Chọn bài giảng đầu tiên mặc định
                }
            } catch (error) {
                console.error('Error fetching course or lessons data:', error);
            }
        };

        fetchData();
    }, [params.slug]);

    const handleLessonClick = (lesson: any) => {
        setSelectedLesson(lesson); // Update the selected lesson
        // Update URL with ?id=lesson._id
        const newUrl = `/learning/${params.slug}?id=${lesson._id}`;
        router.push(newUrl);
    };

    if (!course || !selectedLesson) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };
    return (
        <div className="flex">
            <div className="w-3/4 video-container-learn course-detail-page">
                {/* Hiển thị video của bài giảng đã chọn */}
                <iframe
                    width="1434px"
                    height="686"
                    src={`https://www.youtube.com/embed/${selectedLesson.videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
                <div className="w-[1434px] py-10 px-[100px]">
                    {/* Hiển thị tên của bài giảng */}
                    <h1 className="text-3xl font-bold mb-2">{selectedLesson.name}</h1>
                    <p className="text-gray-500 mb-5"> Cập nhật&nbsp;{formatDate(selectedLesson.createdAt)}</p>

                    <p className="text-lg mb-4">
                        Tham gia các cộng đồng để cùng học hỏi, chia sẻ kinh nghiệm học tập và làm việc nhé!
                    </p>

                    {/* <ul className="list-disc ml-5 mb-10">
                        <li className="mb-2">
                            Fanpage:{' '}
                            <a href="https://www.facebook.com/f8vnofficial" className="text-red-500 hover:underline">
                                https://www.facebook.com/f8vnofficial
                            </a>
                        </li>
                        <li className="mb-2">
                            Group:{' '}
                            <a
                                href="https://www.facebook.com/groups/649972919142215"
                                className="text-red-500 hover:underline"
                            >
                                https://www.facebook.com/groups/649972919142215
                            </a>
                        </li>
                        <li className="mb-2">
                            Youtube:{' '}
                            <a href="https://www.youtube.com/F8VNOofficial" className="text-red-500 hover:underline">
                                https://www.youtube.com/F8VNOofficial
                            </a>
                        </li>
                        <li>
                            Sơn Đặng:{' '}
                            <a href="https://www.facebook.com/sondnf8" className="text-red-500 hover:underline">
                                https://www.facebook.com/sondnf8
                            </a>
                        </li>
                    </ul> */}

                    <div className="flex justify-between items-center border-t pt-5">
                        <div className="text-gray-500">
                            Made with <span className="text-red-500">❤</span> • Powered by KTGruop
                        </div>
                    </div>

                    <button className="fixed bottom-5 right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600">
                        Hỏi đáp
                    </button>
                </div>
            </div>
            <div className="w-1/4 px-3">
                <div className="detail-course">Nội dung khóa học</div>

                {/* Danh sách các bài giảng */}
                <ul className="lesson-list">
                    {lessons.map((lesson, index) => (
                        <li
                            key={lesson._id}
                            className={`lesson-item ${lesson._id === selectedLesson._id ? 'active' : ''}`}
                            onClick={() => handleLessonClick(lesson)}
                        >
                            <span className="lesson-number">{index + 1}. </span>
                            {lesson.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
