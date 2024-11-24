import { useEffect, useRef, useState } from 'react';
import { Button, Image } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React, { Component } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCirclePlay, faClock } from '@fortawesome/free-solid-svg-icons';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { getAllCoursesPublic, getLessonBycourseId } from '~/redux/stateglobal/apiRequest';
import './index.scss';
import Link from 'next/link';
import axios from 'axios';
require('dotenv').config();

const CourseList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCourses);
    const dispatch = useDispatch();
    const router = useRouter();
    const [lessonCounts, setLessonCounts] = useState<any>({});
    const [banners, setBanners] = useState<any[]>([]);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    // Fetch course and lesson data
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchBanners = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/banner/getallbanner');
                setBanners(response.data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        };

        const fetchCourseAndLessonData = async () => {
            if (user?.accessToken) {
                await getAllCoursesPublic(dispatch, axiosJWT);

                // Fetch lessons for each course and count
                const lessonsData = await Promise.all(
                    courseList.map(async (course: any) => {
                        const lessons = await getLessonBycourseId(user.accessToken, course._id, dispatch, axiosJWT);
                        return {
                            courseId: course._id,
                            lessonCount: Array.isArray(lessons) ? lessons.length : 0, // Đảm bảo kiểm tra mảng
                        };
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
        fetchBanners();
    }, []);

    const handleCourseClick = (slug: string, courseId: any) => {
        const isRegistered = user?.registeredCourses?.some((course: any) => course.courseId == courseId);
        if (isRegistered) {
            router.push(`/learning/${slug}`);
        } else {
            router.push(`/courses/${slug}`);
        }
    };
    const sliderRef = useRef<Slider | null>(null);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };
    console.log(sliderRef.current);
    return (
        <div className="w-[calc(100vw-120px)] pl-[40px] pr-[50px]">
            <div className="mt-[18px] pb-3 relative">
                <LeftOutlined
                    className="left-btn"
                    onClick={() => {
                        console.log('Prev clicked');
                        sliderRef.current?.slickPrev();
                    }}
                />
                <Slider ref={sliderRef} {...settings}>
                    {banners.map((banner) => (
                        <div className="rounded-[16px]" key={banner._id}>
                            <img
                                src={banner.url} // Lấy URL từ API
                                className="w-[1710px] h-[600px] object-cover rounded-[16px]"
                                alt={banner.title} // Sử dụng tiêu đề làm alt cho hình ảnh
                            />
                        </div>
                    ))}
                </Slider>
                <RightOutlined
                    className="right-btn"
                    onClick={() => sliderRef.current && sliderRef.current.slickNext()}
                />
            </div>
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
                                className="absolute top-0 left-0 w-full h-full object-contain"
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
