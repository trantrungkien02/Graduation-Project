'use client';
import React, { useEffect, useState } from 'react';
import './index.scss';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAllCoursesPublic, getLessonBycourseId } from '~/redux/stateglobal/apiRequest';
import { createAxios } from '~/app/createInstance';
import { logOutSuccess } from '~/redux/stateglobal/authSlice';

const MyCourse = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector((state: any) => state.auth.login.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCourses);

    const axiosJWT = createAxios(user, dispatch, logOutSuccess);
    const [lessonCounts, setLessonCounts] = useState<any>({});

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchCourseAndLessonData = async () => {
            if (user?.accessToken) {
                await getAllCoursesPublic(dispatch, axiosJWT);

                const lessonsData = await Promise.all(
                    courseList.map(async (course: any) => {
                        const lessons = await getLessonBycourseId(user.accessToken, course._id, dispatch, axiosJWT);
                        return { courseId: course._id, lessonCount: lessons.length };
                    }),
                );

                const lessonCountsMap = lessonsData.reduce((acc: any, data: any) => {
                    acc[data.courseId] = data.lessonCount;
                    return acc;
                }, {});

                setLessonCounts(lessonCountsMap);
            }
        };

        fetchCourseAndLessonData();
    }, []);

    return (
        <div className="w-[calc(100vw-120px)] pl-[40px] pr-[50px]">
            <div className="course-title">Danh sách khóa học của tôi</div>
            <div className="grid grid-cols-5 gap-6 w-full">
                {user?.registeredCourses && user.registeredCourses.length > 0 ? (
                    user.registeredCourses.map((course: any, index: any) => (
                        <Link href={`/learning/${course.courseSlug}`} key={index}>
                            <div className="course-item">
                                <Link
                                    href={`/learning/${course.courseSlug}`}
                                    className="relative block w-full pt-[56.25%] rounded-t-[16px] object-cover overflow-hidden"
                                >
                                    <img
                                        width={200}
                                        src={course.courseAvt}
                                        alt={course.name}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="flex-1 flex flex-col gap-3 p-4 px-5">
                                    <h4 className="text-[18px] font-semibold">{course.courseName}</h4>
                                    <p className="text-sm text-gray-600">
                                        {course.lessonsCompleted > 0 ? (
                                            <>
                                                Đã hoàn thành {course.lessonsCompleted} /{' '}
                                                {lessonCounts[course.courseId]} bài học
                                                <div className="w-full h-1 bg-gray-300 rounded mt-2">
                                                    <div
                                                        className="h-full bg-orange-500 rounded"
                                                        style={{
                                                            width: `${(course.lessonsCompleted / lessonCounts[course.courseId]) * 100}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="mb-4">Bạn chưa học khóa này</p>
                                                <Link
                                                    href={`/learning/${course.courseSlug}`}
                                                    className="text-orange-600 font-semibold"
                                                >
                                                    Bắt đầu học
                                                </Link>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-gray-600 text-center">Bạn chưa đăng ký khóa học nào</div>
                )}
            </div>
        </div>
    );
};

export default MyCourse;
