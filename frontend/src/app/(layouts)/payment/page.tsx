'use client';
import { message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import PaymentForAdsCourse from '~/modules/PaymentForAdsCourse';
import PaymentForBuyCourse from '~/modules/PaymentForBuyCourse';
import PaymentFormModal from '~/modules/PaymentForBuyCourse';
import { getCourseById, registerCourseForUser, updateCourseAddUser } from '~/redux/stateglobal/apiRequest';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { editIsAds } from '~/redux/stateglobal/courseSlice';

export default function CourseOrder() {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseOrder = useSelector((state: any) => state.course.courses?.courseOrder);
    const courseAds = useSelector((state: any) => state.course.courses?.courseAds);
    const isAds = useSelector((state: any) => state.course.courses?.isAds);
    const router = useRouter();
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const searchParams = window.location.search;
    const urlParams = new URLSearchParams(searchParams);
    const vnp_TransactionStatus = urlParams.get('vnp_TransactionStatus');

    const paymentDataBuy = {
        courseName: courseOrder?.name,
        senderUser: user?.username,
        receiveUser: courseOrder?.userName || '',
        amount: urlParams.get('vnp_Amount'),
        transactionStatus: urlParams.get('vnp_TransactionStatus'),
        bankCode: urlParams.get('vnp_BankCode'),
        transactionNo: urlParams.get('vnp_TransactionNo'),
        txnRef: urlParams.get('vnp_TxnRef'),
        type: 'buy',
    };
    const paymentDataAds = {
        courseName: courseAds?.course?.name || '',
        senderUser: user?.username,
        receiveUser: 'Admin',
        amount: urlParams.get('vnp_Amount'),
        transactionStatus: urlParams.get('vnp_TransactionStatus'),
        bankCode: urlParams.get('vnp_BankCode'),
        transactionNo: urlParams.get('vnp_TransactionNo'),
        txnRef: urlParams.get('vnp_TxnRef'),
        type: 'ads',
    };
    console.log(paymentDataAds);
    const hasSavedRef = useRef(false); // Sử dụng ref để theo dõi trạng thái lưu

    useEffect(() => {
        const handleSaveOrder = async () => {
            try {
                if (!vnp_TransactionStatus) {
                    console.log('Không có trạng thái giao dịch');
                    return;
                }
                if (vnp_TransactionStatus === '00') {
                    message.success('Thanh toán thành công!');
                } else {
                    message.error('Thanh toán thất bại!');
                    return;
                }

                const res = await axios.post(`http://localhost:8000/v1/order/add-course-order`, paymentDataBuy);
                if (res.data.message === 'success') {
                    hasSavedRef.current = true;
                    const userData = {
                        userId: user?._id,
                        name: user?.username,
                        email: user?.email,
                        registeredAt: new Date(),
                    };
                    console.log(userData);
                    message.success('Hệ thống đang mở khóa học!');
                    await updateCourseAddUser(user.accessToken, dispatch, courseOrder._id, userData, axiosJWT);

                    const courseDetail = await getCourseById(user.accessToken, courseOrder._id, dispatch, axiosJWT);

                    await registerCourseForUser(user?.accessToken, user?._id, dispatch, courseDetail, axiosJWT);

                    router.push(`/learning/${courseOrder.slug}`);
                } else {
                    message.error('Lưu thanh toán thất bại');
                }
            } catch (error) {
                message.error('Đã xảy ra lỗi khi lưu thanh toán');
                console.error(error);
            }
        };
        const handleSaveAds = async () => {
            try {
                if (!vnp_TransactionStatus) {
                    console.log('Không có trạng thái giao dịch');
                    return;
                }
                if (vnp_TransactionStatus === '00') {
                    message.success('Thanh toán thành công!');
                } else {
                    message.error('Thanh toán thất bại!');
                    return;
                }
                console.log(courseAds);
                const res = await axios.post(`http://localhost:8000/v1/order/add-course-order`, paymentDataAds);
                if (res.data.message === 'success') {
                    hasSavedRef.current = true;
                    const bannerData = {
                        url: courseAds?.course?.image,
                        courseId: courseAds?.course?._id,
                        courseSlug: courseAds?.course?.slug,
                        title: courseAds?.course?.name,
                        description: courseAds?.course?.tittle.replace(/<\/?[^>]+(>|$)/g, ''),
                        endDate: courseAds?.endDate,
                    };
                    console.log(bannerData);
                    const response = await axios.post('http://localhost:8000/v1/banner/create', bannerData);
                    if (response.status === 200) {
                        message.success('Đăng ký quảng cáo thành công');
                        dispatch(editIsAds());
                        router.push('/');
                    } else {
                        message.error('Đăng ký quảng cáo thất bại');
                        router.push('/');
                    }
                } else {
                    message.error('Lưu thanh toán thất bại');
                }
            } catch (error) {
                message.error('Đã xảy ra lỗi khi lưu thanh toán');
                console.error(error);
            }
        };
        if (isAds) {
            handleSaveAds();
        } else {
            handleSaveOrder();
        }
    }, []); // Chỉ phụ thuộc vào vnp_TransactionStatus

    return (
        <div>{isAds ? <PaymentForAdsCourse course={courseAds} /> : <PaymentForBuyCourse course={courseOrder} />}</div>
    );
}
