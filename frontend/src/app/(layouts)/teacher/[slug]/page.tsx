'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { createAxios } from '~/app/createInstance';
import { getAllCoursesByIdUser } from '~/redux/stateglobal/apiRequest';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faClock, faUserGroup } from '@fortawesome/free-solid-svg-icons';

interface UserProps {
    params: { slug: string };
}
interface Course {
    _id: string;
    name: string;
    tittle: string;
}

interface User {
    username: string;
    info: {
        fullName: string;
        avatar: string;
        headerImage: string;
        bio: string;
    };
}
export default function Myteacher({ params }: UserProps) {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [teacher, setTeacher] = useState<User | null>(null);
    const [courseData, setCourseData] = useState<Course[] | null>(null);
    // Thay thế bằng token thực tế

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Gọi API với slug
                const response = await axiosJWT.get(`http://localhost:8000/v1/user/getuserbyslug/${params.slug}`, {
                    headers: { token: `Bearer ${user?.accessToken}` }, // Thêm token vào headers
                });
                const courseData = await getAllCoursesByIdUser(
                    user.accessToken,
                    response.data?._id,
                    dispatch,
                    axiosJWT,
                );
                setTeacher(response.data); // Lưu thông tin người dùng vào state
                setCourseData(courseData);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        };

        fetchUser(); // Gọi hàm fetchUser
    }, [params.slug]); // Chỉ chạy khi `params.slug` thay đổi
    const handleCourseClick = (slug: string, courseId: any) => {
        const isRegistered = user?.registeredCourses?.some((course: any) => course.courseId == courseId);
        if (isRegistered) {
            router.push(`/learning/${slug}`);
        } else {
            router.push(`/courses/${slug}`);
        }
    };
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Section */}
            <div
                className={`relative h-[300px] flex justify-center items-center w-[1700px] rounded-b-md mx-auto ${
                    teacher?.info.headerImage
                        ? 'bg-cover bg-center bg-no-repeat'
                        : 'bg-gradient-to-r from-blue-300 via-pink-300 to-orange-300'
                }`}
                style={{
                    backgroundImage: teacher?.info.headerImage ? `url(${teacher.info.headerImage})` : undefined,
                }}
            >
                <h1 className="text-2xl font-mono text-white">document.write('Hello, World');</h1>
            </div>

            {/* Profile Section */}
            <div className="container mx-auto mt-[-5rem]">
                <div className="bg-white rounded-lg shadow-lg p-6 relative z-10">
                    {/* Avatar */}
                    <div className="flex justify-center">
                        <img
                            src={teacher?.info.avatar || '/default-avatar.png'} // Đường dẫn ảnh hoặc ảnh mặc định
                            alt={teacher?.username || 'Avatar giáo viên'} // Alt text
                            className="w-[200px] h-[200px] rounded-full border-4 border-white -mt-[7rem] object-cover"
                        />
                    </div>
                    {/* User Info */}
                    <div className="text-center mt-4">
                        <h2 className="text-xl font-bold">{teacher?.info.fullName || teacher?.username}</h2>
                        <p>{teacher?.info.bio || 'Chưa cập nhật giới thiệu'}</p>
                    </div>
                </div>
            </div>

            <div className="w-[calc(100vw-120px)] pl-[40px] pr-[50px] mt-3 flex justify-center">
                <div
                    className={`grid ${courseData && courseData?.length < 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center' : 'grid-cols-5'} gap-6 w-full`}
                >
                    {courseData
                        ?.filter((course: any) => course.isPublic === true)
                        ?.map((course: any) => (
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
        </div>
    );
}
