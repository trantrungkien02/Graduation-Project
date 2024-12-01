'use client';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ManageSystem from '~/modules/ManageSystem';

const Page = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== '3') {
            message.error('Bạn không có quyền truy cập trang này!');
            router.push('/');
        }
    }, [user, router]);

    if (!user || user.role !== '3') {
        return null; // Không render nội dung nếu người dùng không có quyền
    }

    return <ManageSystem />;
};

export default Page;
