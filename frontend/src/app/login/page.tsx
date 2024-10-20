'use client';

import Link from 'next/link';
import './page.scss';
import Image from 'next/image';
import { images } from '~/assets/images';
import LoginForm from '~/modules/Login';
import { useState } from 'react';
import RegisterForm from '~/modules/Register';
import ForgotPasswordForm from '~/modules/ForgotPassword';
import { Button } from 'antd';

function Login() {
    return (
        <div>
            <div className="container-login relative">
                <div className="flex boxshadow rounded-[20px]">
                    <div className="w-[450px] bg-[#1261a6] rounded-tl-[20px] rounded-bl-[20px] flex flex-col items-center justify-center ">
                        <h1 className="text-white font-medium text-[35px] leading-[120%] text-center mb-[30px] ">
                            XIN CHÀO
                        </h1>
                        <p className="text-white text-[16px] text-center mb-[30px] px-8">
                            Nhập thông tin cá nhân vủa bạn và bắt đầu hành trình cùng chúng tôi
                        </p>
                        <Link href="/register">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="ant-btn-primary-custom mb-12 p-2 inline-flex items-center justify-center rounded-md transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[#1261a6] bg-white font-semibold text-base h-11 w-[150px] mb-1.2"
                            >
                                ĐĂNG KÝ
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <LoginForm />
                    </div>
                </div>
                <div className="absolute left-0 bottom-7 pl-5 pr-5 text-blue-400 w-full text-base flex justify-between">
                    <Link href="https://www.facebook.com/kien.trantrung.14473426">Powered by Tran Trung Kien</Link>
                    <Link href="https://www.facebook.com/kien.trantrung.14473426">© 2024 KTGroup</Link>
                </div>
                <div className="absolute top-[10px] right-4">
                    <Image alt="Logo" src={images.logo} className="w-[100px]" />
                </div>
            </div>
        </div>
    );
}
export default Login;
