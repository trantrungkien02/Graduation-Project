import { useEffect } from 'react';
import { Button, Image } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faCirclePlay, faClock } from '@fortawesome/free-solid-svg-icons';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { getAllCourses } from '~/redux/stateglobal/apiRequest';
import './index.scss';
import Link from 'next/link';

const CourseList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCourses);

    const msg = useSelector((state: any) => state.users?.msg);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    // Fetch course data
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllCourses(dispatch, axiosJWT);
            console.log(courseList);
        }
    }, []);

    const handleDelete = async (id: any) => {
        // Thêm logic xóa nếu cần
    };

    const handleCourseClick = (slug: string) => {
        router.push(`/courses/${slug}`);
    };
    return (
        <div className="w-[calc(100vw-120px)] pl-[40px] pr-[50px]">
            <div className="course-title">Danh sách khóa học</div>

            <div className="grid grid-cols-5 gap-6 w-full">
                {courseList?.map((course: any, index: number) => (
                    <div key={course._id} className="course-item" onClick={() => handleCourseClick(course.slug)}>
                        <Link
                            href=""
                            className="relative block w-full pt-[56.25%] rounded-t-[16px] object-cover overflow-hidden"
                        >
                            <img
                                width={200}
                                src={course.image}
                                alt={course.name}
                                // fallback="/placeholder.png"
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
                                    <span>123.456</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600 text-[14px]">
                                    <FontAwesomeIcon icon={faCirclePlay} />
                                    <span>12</span>
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
