import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { images } from '~/assets/images';
import {
    SearchOutlined,
    CheckCircleOutlined,
    SmileOutlined,
    InsertRowAboveOutlined,
    DownOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { MenuProps, RadioChangeEvent } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faBell, faQuestionCircle, faUser } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button, Input, Dropdown, Space, Tabs, Empty, Menu, Radio, Badge, Modal, List, Avatar } from 'antd';
import './index.scss';
import { icons } from '~/assets/images/icons/icons';
import Evaluate from './components/Evaluate';
import ChangePassword from './components/ChangePassword';
import MyQrCode from './components/MyQrCode';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { logOutSuccess } from '~/redux/stateglobal/authSlice';
import {
    getAllCourses,
    getAllCoursesByIdUser,
    getLessonBycourseId,
    getNotifyForUser,
    logOut,
    updateNotificationsToRead,
    updateNotificationToRead,
} from '~/redux/stateglobal/apiRequest';

interface Notification {
    _id: string;
    senderName: string;
    tittle: String;
    des: string;
    isRead: boolean;
    readBy: string[];
    lessonId: String;
    courseId: String;
    type: string;
    isGlobal: boolean;
    createdAt: string;
}

function MainNavbar() {
    const dispatch = useDispatch();
    const router = useRouter();

    // State to store courses data
    const [isExpanded, setIsExpanded] = useState(false);
    const [value, setValue] = useState(1);

    // Get user data from Redux store
    const user = useSelector((state: any) => state.auth.login.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCourses);

    const accessToken = user?.accessToken;
    const id = user?._id;

    // Initialize axiosJWT instance for authenticated requests
    const axiosJWT = createAxios(user, dispatch, logOutSuccess);
    const [lessonCounts, setLessonCounts] = useState<any>({});
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fetch courses when component mounts
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

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            const data = await getNotifyForUser(id, user?.role, axiosJWT);
            const unread = data?.filter((notif: any) => !notif.readBy.includes(id)).length;
            setUnreadCount(unread);
            setNotifications(data);
            setLoading(false);
        };
        fetchNotifications();
    }, []);
    // Handlers
    const handleFocus = () => setIsExpanded(true);
    const handleBlur = () => setIsExpanded(false);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const handleLogout = () => {
        logOut(dispatch, id, router, accessToken, axiosJWT);
        console.log(id, accessToken);
        console.log(user);
    };

    const itemsMyCourse = (
        <div className="w-[380px] bg-white p-4 rounded-lg shadow-[0_-4px_32px_rgba(0,0,0,0.2)] max-h-[500px] overflow-auto relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Khóa học của tôi</h3>
                <Link href="/my-courses" className="text-sm text-orange-600">
                    Xem tất cả
                </Link>
            </div>
            <div className="flex flex-col gap-3">
                {user?.registeredCourses && user.registeredCourses.length > 0 ? (
                    user.registeredCourses.map((course: any, index: any) => (
                        <Link href={`/learning/${course.courseSlug}`} key={index}>
                            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-md">
                                <img
                                    src={course.courseAvt}
                                    alt={course.name}
                                    className="w-[120px] h-[68px] rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-gray-800">{course.courseName}</h4>
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
                                                <p>Bạn chưa học khóa này</p>
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

    const markAllAsRead = async () => {
        try {
            setLoading(true);
            const updatedNotifications = await updateNotificationsToRead(id, user?.role, axiosJWT);

            // Cập nhật danh sách thông báo
            setNotifications(updatedNotifications);

            // Tính lại số thông báo chưa đọc
            const unread = updatedNotifications.filter((notif: any) => !notif.readBy.includes(id)).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        } finally {
            setLoading(false);
        }
    };

    const markOneRead = async (courseId: any, lessonId: any, notifyId: string) => {
        if (unreadCount <= 0) {
            // Nếu không có thông báo chưa đọc, chỉ cần hiển thị modal
            const selectedNotif = notifications.find((notif: any) => notif._id === notifyId);
            console.log(selectedNotif);
            setSelectedNotification(selectedNotif || null);
            setIsModalOpen(true);
            return;
        }

        try {
            setLoading(true);

            // Gọi API để cập nhật trạng thái đã đọc
            await updateNotificationToRead(id, notifyId, axiosJWT);

            // Lấy danh sách thông báo mới
            const notifyData = await getNotifyForUser(id, user?.role, axiosJWT);
            setNotifications(notifyData);

            // Tính lại số thông báo chưa đọc
            const unread = notifyData.filter((notif: any) => !notif.readBy.includes(id)).length;
            setUnreadCount(unread);

            // Hiển thị modal chi tiết
            const selectedNotif = notifyData.find((notif: any) => notif._id === notifyId);
            setSelectedNotification(selectedNotif);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        } finally {
            setLoading(false);
        }
    };

    const itemsNotification = (
        <div className="dropdown-notification">
            <div className="flex p-3 items-center justify-between border-solid border-b border-slate-200">
                <p className="font-normal text-base">Thông báo ({notifications?.length})</p>
                <button type="button" onClick={markAllAsRead} disabled={loading}>
                    <div className="font-normal text-sm text-blue-500 items-center flex">
                        Đánh dấu tất cả là đã đọc
                        <CheckCircleOutlined className="ml-1" />
                    </div>
                </button>
            </div>
            <Tabs defaultActiveKey="1" centered>
                <Tabs.TabPane tab="Tất cả" key="1">
                    <div className="list-noti custom-scrollbar p-2 relative h-[300px] overflow-auto">
                        {loading ? (
                            <div className="loading-overlay">
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="text-[20px] mt-[5px] text-[#555] hover:text-[#0b3a82] motion-preset-spin "
                                />
                            </div>
                        ) : notifications?.length > 0 ? (
                            notifications
                                .slice()
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((notif) => (
                                    <div
                                        key={notif._id}
                                        className={`notification-item p-4 border-b border-solid border-slate-200 relative ${notif.readBy.includes(id) ? '' : 'bg-[#dfe7eb]'} my-2 rounded-[16px]`}
                                        onClick={() => {
                                            markOneRead(notif.courseId, notif.lessonId, notif._id);
                                        }}
                                    >
                                        <p className="font-bold mb-2">{notif.tittle}</p>
                                        <p className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {notif.des}
                                        </p>
                                        <span className="text-xs text-gray-500 absolute bottom-2 right-4">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                        ) : (
                            <Empty
                                description="Không có dữ liệu"
                                image={images.noData.default.src}
                                className="p-5 flex flex-col justify-center items-center"
                            />
                        )}
                    </div>
                    <Modal
                        title={selectedNotification?.tittle || 'Thông báo'}
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        footer={null}
                        style={{ borderRadius: '16px' }}
                    >
                        {selectedNotification?.type === 'comment' ||
                        selectedNotification?.type === 'course-notification' ? (
                            <div>
                                <p>
                                    <strong>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-[15px] mt-[5px] text-[#555] hover:text-[#0b3a82]"
                                        />
                                    </strong>{' '}
                                    {selectedNotification?.senderName}
                                </p>
                                <p>
                                    <strong>Mô tả:</strong> {selectedNotification?.des}
                                </p>
                                <p>
                                    <strong>Khóa học:</strong> {selectedNotification?.courseId}
                                </p>
                                <p>
                                    <strong>Thời gian:</strong>{' '}
                                    {new Date(selectedNotification?.createdAt || '').toLocaleString()}
                                </p>
                                <div>
                                    Chuyển hướng đến:{' '}
                                    <strong
                                        onClick={() => {
                                            selectedNotification?.type === 'comment'
                                                ? router.push(
                                                      `/learning/${selectedNotification.courseId}?id=${selectedNotification.lessonId}`,
                                                  )
                                                : router.push(`/learning/${selectedNotification.courseId}`);
                                        }}
                                    >
                                        {selectedNotification?.courseId}
                                    </strong>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>
                                    <strong>
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-[15px] mt-[5px] text-[#555] hover:text-[#0b3a82]"
                                        />
                                    </strong>{' '}
                                    Admin
                                </p>
                                <p>
                                    <strong>Mô tả:</strong> {selectedNotification?.des}
                                </p>
                                <p>
                                    <strong>Thời gian:</strong>{' '}
                                    {new Date(selectedNotification?.createdAt || '').toLocaleString()}
                                </p>
                            </div>
                        )}
                    </Modal>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cá nhân" key="2">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Nhóm" key="3">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Hệ thống" key="4">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );

    const itemsContacts = (
        <div className="dropdown-contact shadow-[0_-4px_32px_rgba(0,0,0,0.2)] w-[442px] mt-1">
            <p className="font-normal text-base text-center p-2.5 border-b border-[#DCDCDC]">Liên hệ trợ giúp</p>
            <div className="px-4 my-5">
                <Link
                    href="tel:+(84) 246 329 5589"
                    className=" flex justify-start items-center bg-[#f2faff] gap-x-2 p-5 mb-2.5"
                >
                    <Image src={icons.iconUser} alt=""></Image>
                    <div>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.85)',
                            }}
                        >
                            Số điện thoại hỗ trợ
                        </p>
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            +(84) 246 329 5589
                        </p>
                    </div>
                </Link>
                <Link
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@tinasoft.vn"
                    className=" flex justify-start items-center bg-[#f2faff] gap-x-2 p-5 mb-2.5"
                >
                    <Image src={icons.iconTele} alt=""></Image>
                    <div>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.85)',
                            }}
                        >
                            Email
                        </p>
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            contact@tinasoft.vn
                        </p>
                    </div>
                </Link>
                <Link
                    href="tel:+(84) 246 329 5589"
                    className=" flex justify-start items-center bg-[#f2faff] gap-x-2 p-5 mb-2.5"
                >
                    <Image src={icons.iconBriefcase} alt=""></Image>
                    <div>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.85)',
                            }}
                        >
                            Địa chỉ hỗ trợ
                        </p>
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            Tầng 4, Tòa nhà Ellipse Tower, 110 Trần Phú, Hà Đông, Hà Nội
                        </p>
                    </div>
                </Link>
            </div>
            <div className="px-4 pb-5">
                <div className="relative">
                    <div className="width: 400px; height: 220px; position: relative; overflow: hidden;"></div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.3797312709403!2d105.78145401112488!3d20.9774101805784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accd83d48047%3A0x66b216d46fa4648d!2zQ8O0bmcgdHkgQ-G7lSBQaOG6p24gVGluYXNvZnQgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1721058600870!5m2!1svi!2s"
                        width="408"
                        height="220"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );

    const itemsLanguage = (
        <div className="dropdown-setting absolute top-[19.5rem]">
            <div className="flex flex-col justify-center">
                <div className="border-b border-[#DCDCDC] px-5 pb-2.5">
                    <p className="text-xs font-medium my-3"> Ngôn ngữ</p>
                    <Radio.Group onChange={onChange} value={value}>
                        <Space direction="vertical">
                            <Radio value={1} className=" text-base font-light text-gray-900 flex py-2 gap-3">
                                Tiếng Việt
                            </Radio>
                            <Radio value={2} className=" text-base font-light text-gray-900 flex py-2 gap-3">
                                English
                            </Radio>
                            <Radio value={3} className=" text-base font-light text-gray-900 flex py-2 gap-3">
                                中國人
                            </Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <div className="border-b border-[#DCDCDC] px-5 pb-5">
                    <p className="text-xs font-medium my-3">Chủ đề</p>
                    <Radio.Group defaultValue={4} style={{ width: '100%' }}>
                        <Radio value={4} className=" text-base font-light text-gray-900 flex items-center py-2 gap-3">
                            <div className="flex items-center">
                                <InsertRowAboveOutlined
                                    style={{
                                        fontSize: '34px',
                                        backgroundColor: 'white',
                                        color: 'rgb(230, 230, 230)',
                                        marginRight: '20px',
                                    }}
                                />
                                <p>Sáng</p>
                            </div>
                        </Radio>
                    </Radio.Group>
                </div>
            </div>
        </div>
    );
    const itemsUser = (
        <div className="dropdown-user w-[320px] ">
            <div className="flex justify-center items-center py-5 px-4 border-b border-[#DCDCDC] relative">
                <Image
                    alt=""
                    src={images.avtUser}
                    className="ant-image-img mt-1 absolute top-4 left-3"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '100%' }}
                />
                <div className="flex flex-col justify-center items-start ml-12 h-[48px]">
                    <span className="font-normal text-lg leading-5">{user?.username}</span>
                    <span className="font-light text-sm leading-5">{user?.email}</span>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start text-[#555]">
                <Link href="/" className="w-full hover:text-[#000]">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] hover:text-[#000] undefined"
                    >
                        Giới thiệu
                    </button>
                </Link>

                <Link href="/profile-account" className="w-full hover:text-[#000]">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] hover:text-[#000] undefined"
                    >
                        Thông tin tài khoản
                    </button>
                </Link>
                <Evaluate />
                <Link href="/terms-of-use" className="w-full hover:text-[#000]">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] border-b border-[#DCDCDC]"
                    >
                        Chính sách về quyền riêng tư
                    </button>
                </Link>
                <Dropdown
                    overlay={itemsLanguage}
                    trigger={['click']}
                    placement="bottom"
                    className="w-full hover:text-[#000]"
                >
                    <button
                        type="button"
                        className=" w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6]  undefined"
                    >
                        <div className="ant-dropdown-trigger text-start w-full cursor-pointer">Language</div>
                    </button>
                </Dropdown>
                <ChangePassword />
                <MyQrCode />
                <button
                    type="button"
                    className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] hover:text-[#000] border-b border-[#DCDCDC] border-t "
                >
                    Danh sách liên hệ của tôi
                </button>
            </div>
            <div className="py-2 text-[#555] hover:text-[#000]">
                <button
                    type="button"
                    className="w-full flex justify-between items-center font-normal leading-normal text-base px-4 py-[9px] hover:bg-[#F6F6F6]"
                    onClick={handleLogout}
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
    const handleSearch = async (value: string) => {
        setSearchTerm(value);

        if (value.trim() === '') {
            setSearchResults([]);
            setIsDropdownVisible(false);
            return;
        }

        try {
            const { data } = await axiosJWT.get(`http://localhost:8000/v1/course/searchforall`, {
                params: { q: value },
            });
            setSearchResults(data); // Cập nhật kết quả tìm kiếm
            setIsDropdownVisible(true); // Hiển thị dropdown
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    const handleCourseClick = (slug: string, courseId: any) => {
        const isRegistered = user?.registeredCourses?.some((course: any) => course.courseId == courseId);
        if (isRegistered) {
            router.push(`/learning/${slug}`);
        } else {
            router.push(`/courses/${slug}`);
        }
    };
    return (
        <div className="navbar flex items-center bg-white">
            <div className="flex items-center navbar-left">
                <Link href="/">
                    <Image alt="" src={images.logo} />
                </Link>
            </div>
            <div
                className={`cursor-pointer expanding-search-global transition-all 'w-[500px]' relative`}
                onClick={handleFocus}
                onBlur={handleBlur}
                tabIndex={0}
            >
                <Input
                    size="large"
                    placeholder="Tìm kiếm khóa học"
                    prefix={<SearchOutlined className="opacity-[.7] mr-1" />}
                    className="rounded-[20px] bg-white h-[40px] ml-[6px] w-[500px]"
                    onChange={(e) => handleSearch(e.target.value)} // Xử lý khi nhập
                    onFocus={() => setIsDropdownVisible(true)} // Hiển thị gợi ý khi focus
                    onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)} // Ẩn gợi ý khi blur
                />

                {/* Dropdown hiển thị gợi ý */}
                {searchTerm.length > 0 && isDropdownVisible ? (
                    searchResults.length > 0 ? (
                        <div className="absolute top-[130%] left-[6px] w-[500px] no-result">
                            <p className=" text-gray-500 text-sm py-[6px]">
                                <SearchOutlined className="opacity-[.7] mr-1" /> Kết quả cho '{searchTerm}'
                            </p>
                            <div className="flex items-center justify-between pt-2 pb-1 border-b border-gray-200 mb-1.5">
                                <h5 className="text-[16px] font-medium text-[#333] m-0">KHÓA HỌC</h5>
                                <Link className="text-[#666]" href="/search">
                                    Xem thêm
                                </Link>
                            </div>
                            <List
                                itemLayout="horizontal"
                                dataSource={searchResults}
                                renderItem={(item: any) => (
                                    <List.Item
                                        className="cursor-pointer  transition-all w-full"
                                        onClick={() => {
                                            handleCourseClick(item?.slug, item?._id);
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item?.image} />}
                                            title={
                                                <span className="text-[16px] overflow-hidden text-ellipsis whitespace-nowrap w-[400] block">
                                                    {item?.name}
                                                </span>
                                            }
                                            description={
                                                <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[400] block">
                                                    {item?.des}
                                                </span>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    ) : (
                        <div className="absolute top-[130%] left-[6px] w-[500px] h-[50px] no-result">
                            <p className=" text-gray-500 text-sm pt-[6px]">
                                <SearchOutlined className="opacity-[.7] mr-1" /> Không có kết quả cho '{searchTerm}'
                            </p>
                        </div>
                    )
                ) : null}
            </div>
            <div className="flex items-center justify-center navbar-right gap-x-3">
                <Dropdown overlay={itemsMyCourse} trigger={['click']}>
                    <Link href="">
                        <Space>
                            <FontAwesomeIcon
                                icon={faBookmark}
                                className="text-[18px] mt-[5px] mr-2 text-[#555] hover:text-[#0b3a82]"
                            />
                        </Space>
                    </Link>
                </Dropdown>
                <Dropdown overlay={itemsNotification} trigger={['click']}>
                    <Link href="">
                        <Space>
                            <Badge count={unreadCount} overflowCount={99} offset={[3, 0]}>
                                <FontAwesomeIcon
                                    icon={faBell}
                                    className={`text-[22px] mt-[5px] text-[#555] hover:text-[#0b3a82] ${unreadCount > 0 ? 'motion-preset-seesaw' : ''}`}
                                />
                            </Badge>
                        </Space>
                    </Link>
                </Dropdown>

                <Dropdown overlay={itemsContacts} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <FontAwesomeIcon
                                icon={faQuestionCircle}
                                className="text-[22px] mt-[5px] text-[#555] hover:text-[#0b3a82] ml-2"
                            />
                        </Space>
                    </a>
                </Dropdown>
                <Dropdown overlay={itemsUser} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Image
                                alt=""
                                src={images.avtUser}
                                className="ant-image-img mt-1"
                                style={{ height: '31px', objectFit: 'cover', borderRadius: '100%' }}
                            />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </div>
    );
}

export default MainNavbar;
