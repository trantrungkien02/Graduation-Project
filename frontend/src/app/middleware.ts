// app/middleware.ts

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { useSelector } from 'react-redux';

export function middleware(req: NextRequest) {
    // Giả sử bạn lưu thông tin user trong cookie hoặc session
    const currentUser = useSelector((state: any) => state.auth.login?.currentUser);

    // Kiểm tra nếu user có role 2 (giảng viên), nếu không chuyển hướng
    if (currentUser && currentUser.role !== '2') {
        return NextResponse.redirect(new URL('/not-authorized', req.url)); // Chuyển hướng đến trang không được phép
    }

    return NextResponse.next(); // Nếu user có role 2, cho phép tiếp tục
}

export const config = {
    matcher: ['/manage-course'], // Đảm bảo rằng middleware này chỉ áp dụng cho trang /manage-course
};
