'use client';
import React, { useEffect } from 'react';
import { Button, Form, Input, message, Select, Tabs } from 'antd';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createNotify, getAllUsers, getNotifyForAdmin, registerCourse } from '~/redux/stateglobal/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import axios from 'axios';
import { createAxios } from '~/app/createInstance';
import { logOutSuccess } from '~/redux/stateglobal/authSlice';
import NotifyList from './NotifyListById';
import BannerList from './BannerList';
import CoursePrivateList from './CoursePrivateList';
import Charts from '../Statistical';
import PaymentList from './PaymentList';
function ManageSystem() {
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCourses);
    const axiosJWT = createAxios(user, dispatch, logOutSuccess);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllUsers(user?.accessToken, dispatch, axiosJWT);
        }
    }, []);
    const onFinish = async (values: any) => {
        try {
            // Thêm id của người dùng vào values
            const dataToSend = {
                ...values,
                senderId: user?._id,
                senderName: 'Admin',
                isGlobal: values.role === 'all' ? true : false,
                type: 'system',
            };
            console.log(dataToSend);
            const response = await createNotify(dataToSend, axiosJWT);
            console.log(response);

            if (typeof response === 'object') {
                form.resetFields();
                message.success('Thông báo đã được thêm thành công!');
                await getNotifyForAdmin(user._id, axiosJWT);
                // setTimeout(() => {
                //     router.push('/');
                // }, 5000);
            } else if (typeof response === 'string') {
                message.success('Thông báo đã tồn tại');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error('Đã xảy ra lỗi khi thêm khóa học!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };
    const dataFake = [
        {
            _id: 1,
            userId: '670a2594668c24899143da18',
            name: 'Bán Lẩu',
            des: 'Chuyên nghiệp',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/mvrbb4nll8g1mij1rpmg.jpg',
            videoId: 'fdgdgdfgdfghik',
            level: 'Cơ bản',
            price: '1000000',
            registrations: 2,
            deleted: false,
            createdAt: '2024-11-12T09:52:26.197Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'ban-lau',
            __v: 0,
            registeredUsers: [
                {
                    userId: '671c8f32bfa1576d99f49e46',
                    name: 'B20DCPT106 Trần Trung Kiên',
                    email: 'kiencutet@gmail.com',
                    lessonCompleted: 0,
                    registeredAt: '2024-11-27T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 2,
            userId: '670b2594668c24899143db19',
            name: 'Học React',
            des: 'Nâng cao chuyên môn',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/react.jpg',
            videoId: 'abc123',
            level: 'Nâng cao',
            price: '2000000',
            registrations: 5,
            deleted: false,
            createdAt: '2024-10-10T08:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'hoc-react',
            __v: 0,
            registeredUsers: [
                {
                    userId: '671d9f33bfa1576d99f49e47',
                    name: 'B20DCPT107 Nguyễn Văn A',
                    email: 'nguyenvana@gmail.com',
                    lessonCompleted: 3,
                    registeredAt: '2024-11-20T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 3,
            userId: '671c9f33bfa1576d99f49e48',
            name: 'Học Angular',
            des: 'Thành thạo Angular',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/angular.jpg',
            videoId: 'xyz456',
            level: 'Trung cấp',
            price: '1500000',
            registrations: 3,
            deleted: false,
            createdAt: '2024-09-15T09:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'hoc-angular',
            __v: 0,
            registeredUsers: [
                {
                    userId: '671e9f34bfa1576d99f49e49',
                    name: 'B20DCPT108 Phạm Minh B',
                    email: 'phamminhb@gmail.com',
                    lessonCompleted: 2,
                    registeredAt: '2024-11-10T06:40:58.971Z',
                },
            ],
            isPublic: false,
            userName: 'admin',
        },
        {
            _id: 4,
            userId: '670f2594668c24899143dc20',
            name: 'JavaScript Cơ Bản',
            des: 'Học nhanh JavaScript',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/js.jpg',
            videoId: 'js123',
            level: 'Cơ bản',
            price: '500000',
            registrations: 8,
            deleted: false,
            createdAt: '2024-07-20T10:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'javascript-co-ban',
            __v: 0,
            registeredUsers: [
                {
                    userId: '671f9f35bfa1576d99f49e50',
                    name: 'B20DCPT109 Lê Thanh C',
                    email: 'lethanhc@gmail.com',
                    lessonCompleted: 4,
                    registeredAt: '2024-10-25T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 5,
            userId: '670a2594668c24899143da18',
            name: 'Thực Hành Node.js',
            des: 'Xây dựng server với Node.js',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/nodejs.jpg',
            videoId: 'node987',
            level: 'Nâng cao',
            price: '1200000',
            registrations: 6,
            deleted: false,
            createdAt: '2024-10-01T12:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'thuc-hanh-nodejs',
            __v: 0,
            registeredUsers: [
                {
                    userId: '672c8f32bfa1576d99f49e51',
                    name: 'B20DCPT110 Nguyễn Minh T',
                    email: 'nguyenminht@gmail.com',
                    lessonCompleted: 5,
                    registeredAt: '2024-11-15T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 6,
            userId: '670b2594668c24899143db21',
            name: 'Dạy Phân Tích Dữ Liệu',
            des: 'Nâng cao kỹ năng phân tích',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/data_analysis.jpg',
            videoId: 'data001',
            level: 'Cao cấp',
            price: '2500000',
            registrations: 3,
            deleted: false,
            createdAt: '2024-08-15T15:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'day-phan-tich-du-lieu',
            __v: 0,
            registeredUsers: [
                {
                    userId: '672d9f32bfa1576d99f49e52',
                    name: 'B20DCPT111 Lê Phương H',
                    email: 'lephuongh@gmail.com',
                    lessonCompleted: 2,
                    registeredAt: '2024-11-12T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 7,
            userId: '670f2594668c24899143dc22',
            name: 'Xây Dựng Website WordPress',
            des: 'Tạo website với WordPress',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/wordpress.jpg',
            videoId: 'wp001',
            level: 'Cơ bản',
            price: '1000000',
            registrations: 10,
            deleted: false,
            createdAt: '2024-09-10T14:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'xay-dung-website-wordpress',
            __v: 0,
            registeredUsers: [
                {
                    userId: '673e9f34bfa1576d99f49e53',
                    name: 'B20DCPT112 Hoàng Minh T',
                    email: 'hoangmint@gmail.com',
                    lessonCompleted: 3,
                    registeredAt: '2024-11-05T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 8,
            userId: '670a2594668c24899143da20',
            name: 'Kỹ Năng Phỏng Vấn',
            des: 'Tạo ấn tượng trong phỏng vấn',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/interview_skills.jpg',
            videoId: 'interview99',
            level: 'Nâng cao',
            price: '900000',
            registrations: 7,
            deleted: false,
            createdAt: '2024-10-05T11:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'ky-nang-phong-van',
            __v: 0,
            registeredUsers: [
                {
                    userId: '674e9f35bfa1576d99f49e54',
                    name: 'B20DCPT113 Trần Minh K',
                    email: 'tranminhk@gmail.com',
                    lessonCompleted: 4,
                    registeredAt: '2024-11-08T06:40:58.971Z',
                },
            ],
            isPublic: false,
            userName: 'giangvien',
        },
        {
            _id: 9,
            userId: '670b2594668c24899143dc23',
            name: 'Bí Quyết Lập Trình',
            des: 'Bí quyết để thành công trong lập trình',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/coding_tips.jpg',
            videoId: 'codingtips123',
            level: 'Trung cấp',
            price: '600000',
            registrations: 4,
            deleted: false,
            createdAt: '2024-11-10T09:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'bi-quyet-lap-trinh',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e55',
                    name: 'B20DCPT114 Nguyễn Xuân D',
                    email: 'nguyenxduan@gmail.com',
                    lessonCompleted: 1,
                    registeredAt: '2024-11-01T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },

        {
            _id: 10,
            userId: '670b2594668c24899143dc24',
            name: 'Tiếng Anh Giao Tiếp Cơ Bản',
            des: 'Khóa học dành cho những người mới bắt đầu học tiếng Anh.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/english_basic.jpg',
            videoId: 'englishbasic001',
            level: 'Cơ bản',
            price: '500000',
            registrations: 10,
            deleted: false,
            createdAt: '2024-11-01T09:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'tieng-anh-giao-tiep-co-ban',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e50',
                    name: 'B20DCPT115 Trần Văn T',
                    email: 'tranvantan@gmail.com',
                    lessonCompleted: 3,
                    registeredAt: '2024-11-02T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 11,
            userId: '670b2594668c24899143dc25',
            name: 'Tiếng Anh Giao Tiếp Nâng Cao',
            des: 'Khóa học nâng cao giúp cải thiện khả năng giao tiếp tiếng Anh.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/english_advanced.jpg',
            videoId: 'englishadvanced002',
            level: 'Nâng cao',
            price: '800000',
            registrations: 15,
            deleted: false,
            createdAt: '2024-11-03T10:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'tieng-anh-giao-tiep-nang-cao',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e51',
                    name: 'B20DCPT116 Nguyễn Thị H',
                    email: 'nguyenhien@gmail.com',
                    lessonCompleted: 5,
                    registeredAt: '2024-11-04T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'zaolusi',
        },
        {
            _id: 12,
            userId: '670b2594668c24899143dc26',
            name: 'Luyện Nghe Tiếng Anh',
            des: 'Khóa học giúp nâng cao kỹ năng nghe tiếng Anh.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/english_listening.jpg',
            videoId: 'englishlistening003',
            level: 'Trung cấp',
            price: '600000',
            registrations: 8,
            deleted: false,
            createdAt: '2024-11-05T11:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'luyen-nghe-tieng-anh',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e52',
                    name: 'B20DCPT117 Lê Minh T',
                    email: 'leminhtrang@gmail.com',
                    lessonCompleted: 2,
                    registeredAt: '2024-11-06T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'bailiu',
        },
        {
            _id: 13,
            userId: '670b2594668c24899143dc27',
            name: 'Tiếng Anh Chuyên Ngành Kinh Tế',
            des: 'Khóa học tiếng Anh chuyên ngành dành cho người làm trong lĩnh vực kinh tế.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/english_economics.jpg',
            videoId: 'englisheconomics004',
            level: 'Chuyên ngành',
            price: '1000000',
            registrations: 5,
            deleted: false,
            createdAt: '2024-11-07T12:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'tieng-anh-chuyen-nganh-kinh-te',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e53',
                    name: 'B20DCPT118 Nguyễn Đức S',
                    email: 'nguyenducson@gmail.com',
                    lessonCompleted: 4,
                    registeredAt: '2024-11-08T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'lavanhi',
        },
        {
            _id: 14,
            userId: '670b2594668c24899143dc28',
            name: 'Luyện Viết Tiếng Anh',
            des: 'Khóa học giúp cải thiện kỹ năng viết tiếng Anh cho người học.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/english_writing.jpg',
            videoId: 'englishwriting005',
            level: 'Cơ bản',
            price: '500000',
            registrations: 20,
            deleted: false,
            createdAt: '2024-11-09T14:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'luyen-viet-tieng-anh',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e54',
                    name: 'B20DCPT119 Lê Thanh T',
                    email: 'lethanhtrang@gmail.com',
                    lessonCompleted: 6,
                    registeredAt: '2024-11-10T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 15,
            userId: '670b2594668c24899143dc29',
            name: 'Tiếng Anh Thương Mại',
            des: 'Khóa học tiếng Anh chuyên về giao tiếp trong công việc.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/business_english.jpg',
            videoId: 'businessenglish006',
            level: 'Trung cấp',
            price: '750000',
            registrations: 12,
            deleted: false,
            createdAt: '2024-11-12T15:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'tieng-anh-thuong-mai',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e55',
                    name: 'B20DCPT120 Trần Quốc K',
                    email: 'tranquockhanh@gmail.com',
                    lessonCompleted: 3,
                    registeredAt: '2024-11-13T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 16,
            userId: '670b2594668c24899143dc30',
            name: 'Tiếng Anh Du Lịch',
            des: 'Khóa học tiếng Anh cho những ai muốn làm việc trong ngành du lịch.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/travel_english.jpg',
            videoId: 'travelenglish007',
            level: 'Cơ bản',
            price: '550000',
            registrations: 7,
            deleted: false,
            createdAt: '2024-11-13T17:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'tieng-anh-du-lich',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e56',
                    name: 'B20DCPT121 Phan Minh T',
                    email: 'phanminhthao@gmail.com',
                    lessonCompleted: 2,
                    registeredAt: '2024-11-14T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 17,
            userId: '670b2594668c24899143dc31',
            name: 'Tiếng Anh Đặc Biệt Cho Doanh Nhân',
            des: 'Khóa học tiếng Anh chuyên biệt cho doanh nhân.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/business_english_for_ceo.jpg',
            videoId: 'ceoenglish008',
            level: 'Chuyên ngành',
            price: '1200000',
            registrations: 3,
            deleted: false,
            createdAt: '2024-11-15T18:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'tieng-anh-dac-biet-cho-doanh-nhan',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e57',
                    name: 'B20DCPT122 Nguyễn Hùng D',
                    email: 'nguyenhungduong@gmail.com',
                    lessonCompleted: 1,
                    registeredAt: '2024-11-16T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 18,
            userId: '670b2594668c24899143dc32',
            name: 'Luyện Phát Âm Tiếng Anh',
            des: 'Khóa học tập trung vào luyện phát âm tiếng Anh chuẩn.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/english_pronunciation.jpg',
            videoId: 'englishpronunciation009',
            level: 'Cơ bản',
            price: '500000',
            registrations: 9,
            deleted: false,
            createdAt: '2024-11-17T19:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'luyen-phat-am-tieng-anh',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e58',
                    name: 'B20DCPT123 Phan Quỳnh H',
                    email: 'phanquynhha@gmail.com',
                    lessonCompleted: 7,
                    registeredAt: '2024-11-18T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
        {
            _id: 19,
            userId: '670b2594668c24899143dc33',
            name: 'Tiếng Anh Cho Người Mới Bắt Đầu',
            des: 'Khóa học dành cho người bắt đầu học tiếng Anh từ con số 0.',
            image: 'https://res.cloudinary.com/dxlgsujti/image/upload/v1732271309/english_for_beginners.jpg',
            videoId: 'englishforbeginners010',
            level: 'Cơ bản',
            price: '450000',
            registrations: 18,
            deleted: false,
            createdAt: '2024-11-19T20:00:00.000Z',
            updatedAt: '2024-11-27T06:40:58.987Z',
            slug: 'tieng-anh-cho-nguoi-moi-bat-dau',
            __v: 0,
            registeredUsers: [
                {
                    userId: '675e9f36bfa1576d99f49e59',
                    name: 'B20DCPT124 Đặng Thị L',
                    email: 'dangthilinh@gmail.com',
                    lessonCompleted: 8,
                    registeredAt: '2024-11-20T06:40:58.971Z',
                },
            ],
            isPublic: true,
            userName: 'giangvien',
        },
    ];

    return (
        <div className="add-course-form-container">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                style={{ zIndex: 9999 }} // Tăng z-index lên
            />
            <h2 className="manage-title">Quản lý hệ thống</h2>
            <Tabs defaultActiveKey="1" className="pl-5 target-nav">
                <Tabs.TabPane tab={<div>Quản lý khóa học chờ duyệt</div>} key="1">
                    <CoursePrivateList />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Thêm thông báo</div>} key="2">
                    <Form
                        form={form}
                        name="add-course"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 12 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className="add-course-form"
                    >
                        <Form.Item
                            label="Tên thông báo"
                            name="tittle"
                            rules={[{ required: true, message: 'Tên thông báo không được để trống!' }]}
                        >
                            <Input placeholder="Nhập tên thông báo" />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="des"
                            rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả cho thông báo" />
                        </Form.Item>
                        <Form.Item
                            label="Người nhận"
                            name="role"
                            rules={[{ required: false, message: 'Người nhận không được để trống' }]}
                            initialValue="all"
                        >
                            <Select
                                showSearch
                                placeholder="Tất cả"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'all',
                                        label: 'Tất cả',
                                    },
                                    {
                                        value: '1',
                                        label: 'Học viên',
                                    },
                                    {
                                        value: '2',
                                        label: 'Giảng viên',
                                    },
                                ]}
                                className="w-[344px] select-regis"
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="ml-[300px]">
                            Thêm Thông báo
                        </Button>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Xem danh sách thông báo</div>} key="3">
                    <NotifyList />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Quản lý banner</div>} key="4">
                    <BannerList />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Quản lý thanh toán</div>} key="5">
                    <PaymentList />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Thống kê</div>} key="6">
                    <Charts data={courseList} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}

export default ManageSystem;
