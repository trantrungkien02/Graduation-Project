'use client';
import { useEffect, useState } from 'react';
import { fetchCourseBySlug, getLessonBycourseId, updateUser } from '~/redux/stateglobal/apiRequest';
import './page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { loginCourseForUserSuccess, loginSuccess } from '~/redux/stateglobal/authSlice';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

interface CourseDetailPageProps {
    params: { slug: string };
}

interface Lesson {
    _id: string;
    name: string;
    videoId: string;
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
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [player, setPlayer] = useState<any>(null);
    const [indexLesson, setIndexLesson] = useState(0);
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

                const lessonIdFromUrl = new URLSearchParams(window.location.search).get('id');
                const initialLesson = lessonIdFromUrl
                    ? lessonsData.find((lesson: any) => lesson._id === lessonIdFromUrl)
                    : lessonsData[0];
                setSelectedLesson(initialLesson || lessonsData[0]);
            } catch (error) {
                console.error('Error fetching course or lessons data:', error);
            }
        };

        fetchData();
    }, [params.slug]);

    useEffect(() => {
        if (selectedLesson) {
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
    }, [selectedLesson]); // Ensure this runs each time selectedLesson changes

    const initializePlayer = () => {
        if (!selectedLesson) return;

        // If player exists, destroy it before creating a new one
        if (player) {
            player.destroy();
        }

        const newPlayer = new window.YT.Player('video-player', {
            videoId: selectedLesson.videoId,
            events: {
                onStateChange: onPlayerStateChange,
            },
        });
        setPlayer(newPlayer); // Update the player state to hold the new player instance
    };

    const convertDurationToSeconds = (duration: string): number => {
        const timeParts = duration.split(':');
        let totalSeconds = 0;

        if (timeParts.length === 2) {
            // Format MM:SS
            totalSeconds = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
        } else if (timeParts.length === 3) {
            // Format HH:MM:SS
            totalSeconds =
                parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
        }

        return totalSeconds;
    };

    const onPlayerStateChange = async (event: any) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            console.log('Video has ended. Unlocking the next lesson...');
            console.log(player);
            // Lấy khóa học cần cập nhật từ registeredCourses
            const currentCourse1 = user?.registeredCourses.find((currentCourse: any) => {
                return currentCourse.courseId == course._id;
            });
            if (!currentCourse1) return;

            const currentLessonsCompleted = currentCourse1.lessonsCompleted || 0;
            const updatedLessonsCompleted = currentLessonsCompleted + 1;

            // Kiểm tra nếu bài học cuối cùng được xem (mới mở khóa bài học tiếp theo)
            console.log(currentLessonsCompleted, indexLesson);

            if (currentLessonsCompleted == indexLesson) {
                // Cập nhật số lượng bài học đã hoàn thành cho khóa học
                const updatedRegisteredCourses = user?.registeredCourses.map((course: any) => {
                    if (course.courseId === currentCourse1.courseId) {
                        return {
                            ...course,
                            lessonsCompleted: updatedLessonsCompleted,
                        };
                    }
                    return course;
                });

                // Gửi yêu cầu API để cập nhật người dùng với dữ liệu mới
                const { accessToken, ...userWithoutToken } = user;

                const updatedUser = {
                    ...userWithoutToken,
                    registeredCourses: updatedRegisteredCourses,
                };

                // Gửi yêu cầu API để cập nhật người dùng
                const updatedUserData = await updateUser(updatedUser, dispatch);

                // Cập nhật lại người dùng trong Redux
                dispatch(loginCourseForUserSuccess(updatedUserData));
            }

            // Mở khóa bài học tiếp theo nếu người dùng hoàn thành bài học cuối cùng
            setLessons(
                lessons.map((lesson, index) => {
                    const updatedLesson = { ...lesson }; // Sao chép đối tượng lesson
                    if (index <= updatedLessonsCompleted) {
                        updatedLesson.locked = false; // Mở khóa bài học
                    }
                    return updatedLesson;
                }),
            );
        }
    };

    const handleLessonClick = (lesson: Lesson, index: number) => {
        setIndexLesson(index);
        const currentCourse = user?.registeredCourses.find((currentCourse: any) => {
            return currentCourse.courseId == course._id;
        });
        console.log(currentCourse);
        const lessonsCompleted = currentCourse ? currentCourse.lessonsCompleted : 0;
        console.log(index, lessonsCompleted);

        // Kiểm tra nếu bài học bị khóa
        if (index > lessonsCompleted) {
            message.error('Bạn cần hoàn thành bài học trước để tiếp tục!!');
        } else {
            setSelectedLesson(lesson); // Cập nhật bài học được chọn khi click
            router.push(`/learning/${params.slug}?id=${lesson._id}`); // Chuyển hướng tới bài học đã chọn
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    if (!course || !selectedLesson) {
        return <div>Loading course details...</div>;
    }

    return (
        <div className="flex">
            <div className="w-3/4 video-container-learn course-detail-page">
                {/* YouTube Player */}
                <div id="video-player" className="w-full h-[686px]"></div>
                <div className="w-full py-10 px-[100px]">
                    <h1 className="text-3xl font-bold mb-2">{selectedLesson.name}</h1>
                    {selectedLesson.createdAt && (
                        <p className="text-gray-500 mb-5"> Cập nhật&nbsp;{formatDate(selectedLesson.createdAt)}</p>
                    )}
                    <p className="text-lg mb-4">
                        Tham gia các cộng đồng để cùng học hỏi, chia sẻ kinh nghiệm học tập và làm việc nhé!
                    </p>
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
                <ul className="lesson-list">
                    {lessons.map((lesson, index) => {
                        // Tìm khóa học tương ứng với lesson (dựa trên courseId)
                        const currentCourse = user?.registeredCourses.find((currentCourse: any) => {
                            console.log(currentCourse.courseId, course._id);
                            return currentCourse.courseId == course._id;
                        });
                        console.log(currentCourse);
                        // Nếu không tìm thấy khóa học, mặc định lessonsCompleted là 0
                        const lessonsCompleted = currentCourse ? currentCourse.lessonsCompleted : 0;

                        // Xác định bài học có bị khóa không
                        const isLocked = index > lessonsCompleted;

                        return (
                            <li
                                key={lesson._id}
                                className={`lesson-item ${lesson._id === selectedLesson._id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                onClick={() => handleLessonClick(lesson, index)}
                                style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                            >
                                <div>
                                    <span className="lesson-number">{index + 1}. </span>
                                    <span>{lesson.name}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
