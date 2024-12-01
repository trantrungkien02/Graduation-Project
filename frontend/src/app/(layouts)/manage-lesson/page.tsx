'use client';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ManageLesson from '~/modules/ManageLesson';

const Page = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== '2') {
            message.error('Bạn không có quyền truy cập trang này!');
            router.push('/');
        }
    }, [user, router]);

    if (!user || user.role !== '2') {
        return null; // Không render nội dung nếu người dùng không có quyền
    }

    return <ManageLesson />;
};

export default Page;
