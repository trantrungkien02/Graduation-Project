import { useEffect, useState } from 'react';
import { Button, Image } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCirclePlay, faClock } from '@fortawesome/free-solid-svg-icons';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { getAllCourses, getLessonBycourseId } from '~/redux/stateglobal/apiRequest';
import './index.scss';
import Link from 'next/link';
require('dotenv').config();

const CourseList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCourses);
    const dispatch = useDispatch();
    const router = useRouter();
    const [lessonCounts, setLessonCounts] = useState<any>({});

    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    // Fetch course and lesson data
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchCourseAndLessonData = async () => {
            if (user?.accessToken) {
                await getAllCourses(dispatch, axiosJWT);

                // Fetch lessons for each course and count
                const lessonsData = await Promise.all(
                    courseList.map(async (course: any) => {
                        const lessons = await getLessonBycourseId(user.accessToken, course._id, dispatch, axiosJWT);
                        return { courseId: course._id, lessonCount: lessons.length };
                    }),
                );

                // Map lesson counts by course ID
                const lessonCountsMap = lessonsData.reduce((acc: any, data: any) => {
                    acc[data.courseId] = data.lessonCount;
                    return acc;
                }, {});

                setLessonCounts(lessonCountsMap);
            }
        };

        fetchCourseAndLessonData();
    }, []);

    const handleCourseClick = (slug: string, courseId: any) => {
        const isRegistered = user?.registeredCourses?.some((course: any) => course.courseId == courseId);
        if (isRegistered) {
            router.push(`/learning/${slug}`);
        } else {
            router.push(`/courses/${slug}`);
        }
    };

    return (
        <div className="w-[calc(100vw-120px)] pl-[40px] pr-[50px]">
            <div className="course-title">Danh sách khóa học</div>
            <div className="grid grid-cols-5 gap-6 w-full">
                {courseList?.map((course: any) => (
                    <div
                        key={course._id}
                        className="course-item"
                        onClick={() => handleCourseClick(course.slug, course._id)}
                    >
                        <Link
                            href=""
                            className="relative block w-full pt-[56.25%] rounded-t-[16px] object-cover overflow-hidden"
                        >
                            <img
                                width={200}
                                src={course.image}
                                alt={course.name}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                        </Link>
                        <div className="flex-1 flex flex-col gap-3 p-4 px-5">
                            <h3 className="text-[18px] font-semibold">{course.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[16px] font-semibold text-[#f05123]">Miễn phí</span>
                            </div>
                            <div className="flex justify-between mt-auto">
                                <div className="flex items-center gap-1.5 text-gray-600 text-[14px]">
                                    <FontAwesomeIcon icon={faUserGroup} />
                                    <span>{course.registrations}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 text-[14px]">
                                    <FontAwesomeIcon icon={faCirclePlay} />
                                    <span>{lessonCounts[course._id] || 0}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 text-[14px]">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span>3:45</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
