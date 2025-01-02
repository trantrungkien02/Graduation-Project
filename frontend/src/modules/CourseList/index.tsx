import { useEffect, useRef, useState } from 'react';
import { Button, Image, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React, { Component } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCirclePlay, faStar } from '@fortawesome/free-solid-svg-icons';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { getAllCoursesPublic, getAllUsers, getLessonBycourseId } from '~/redux/stateglobal/apiRequest';
import './index.scss';
import Link from 'next/link';
import axios from 'axios';
import UserCard from './UserCard';

require('dotenv').config();

const CourseList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const userList = useSelector((state: any) => state.users.users?.allUsers);
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
        }
        if (user?.accessToken) {
            getAllUsers(user?.accessToken, dispatch, axiosJWT);
        }

        const fetchBanners = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/banner/getallbanner');
                const banners = response.data;

                // Lọc danh sách banner có endDate <= ngày hiện tại
                const now = new Date();
                const expiredBanners = banners.filter(
                    (banner: any) => new Date(banner.endDate).getTime() <= now.getTime(),
                );

                // Gọi API delete cho từng banner hết hạn
                for (const banner of expiredBanners) {
                    await axios.delete(`http://localhost:8000/v1/banner/delete/${banner._id}`);
                }

                // Cập nhật danh sách banner sau khi xóa
                setBanners(banners.filter((banner: any) => !expiredBanners.includes(banner)));
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
            {user?.isLimit === '1' ? (
                <div className="flex items-center justify-center h-[100vh] text-center">
                    <p className="text-xl text-red-500 font-bold">
                        Tài khoản của bạn đang bị giới hạn, vui lòng liên hệ quản trị viên để giải quyết.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mt-[18px] pb-3 relative h-[368px]">
                        {banners.length > 1 ? (
                            <>
                                <LeftOutlined className="left-btn" onClick={() => sliderRef.current?.slickPrev()} />
                                <Slider ref={sliderRef} {...settings}>
                                    {banners.map((banner) => (
                                        <div className="!flex !items-center !justify-between bg-gradient-to-r from-[#626466] to-[#d6dcf1] rounded-lg p-8 h-[368px]">
                                            <div className="text-white max-w-lg flex flex-col">
                                                <h1 className="text-4xl font-bold mb-4 text-white">{banner?.title}</h1>
                                                <p className="text-lg mb-6">{banner?.description}</p>
                                                <button
                                                    className="px-6 py-3 hover:shadow-lg bg-[#f5f5f5] text-[#1261a6] font-medium rounded-lg transition duration-300"
                                                    onClick={() =>
                                                        handleCourseClick(banner?.courseSlug, banner?.courseId)
                                                    }
                                                >
                                                    Xem ngay
                                                </button>
                                            </div>
                                            <div>
                                                <img
                                                    src={banner?.url}
                                                    alt="Banner"
                                                    width={500}
                                                    height={300}
                                                    className="rounded-[16px] object-contain max-h-[300px]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                                <RightOutlined className="right-btn" onClick={() => sliderRef.current?.slickNext()} />
                            </>
                        ) : (
                            <div className="!flex !items-center !justify-between bg-gradient-to-r from-[#626466] to-[#d6dcf1] rounded-lg p-8 h-[368px]">
                                <div className="text-white max-w-lg flex flex-col">
                                    <h1 className="text-4xl font-bold mb-4 text-white">{banners[0]?.title}</h1>
                                    <p className="text-lg mb-6">{banners[0]?.description}</p>
                                    <button
                                        className="px-6 py-3 hover:shadow-lg bg-[#f5f5f5] text-[#1261a6] font-medium rounded-lg transition duration-300"
                                        onClick={() => handleCourseClick(banners[0]?.courseSlug, banners[0]?.courseId)}
                                    >
                                        Xem ngay
                                    </button>
                                </div>
                                <div>
                                    <img
                                        src={banners[0]?.url}
                                        alt="Banner"
                                        width={500}
                                        height={300}
                                        className="rounded-[16px] object-contain max-h-[300px]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="">
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
                                        <h3 className="text-[18px] font-semibold min-h-[54px]">{course.name}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-[16px] font-semibold text-[#f05123]">
                                                {course.price != 'Miễn phí' ? `${course.price} đ` : 'Miễn phí'}
                                            </span>
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
                                                <FontAwesomeIcon icon={faStar} />
                                                <span>5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="">
                        <div className="course-title">Danh sách giảng viên</div>
                        <div className="grid grid-cols-5 gap-6 w-full">
                            {userList
                                ?.filter((user: any) => user.role === '2')
                                .map((user: any, index: any) => <UserCard key={index} user={user} />)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CourseList;
