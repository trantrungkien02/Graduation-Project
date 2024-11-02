'use client';
import { Button, Form, Input } from 'antd';
import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import './index.scss';
import { icons } from '~/assets/images/icons/icons';
import RegisterForm from '../Register';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginGoogle, loginUser } from '~/redux/stateglobal/apiRequest';

interface FormProps {
    switchToRegister?: () => void;
    switchToLogin?: () => void;
    switchToForgotPassword?: () => void;
}

function LoginForm() {
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();

    const onFinish = async (values: Object) => {
        console.log('Form Values:', values);

        try {
            const res = await loginUser(values, dispatch, router);
            if (res === 'Incorrect username or email') {
                toast.error('Email hoặc tên tài khoản không đúng!', {
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
            } else if (res === 'Incorrect password') {
                toast.error('Mật khẩu không đúng!', {
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

            console.log(values);
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };
    const switchToRegister = () => {
        router.push('/register');
    };
    const switchToForgotPassword = () => {
        router.push('/register');
    };
    const validatePassword = async (_: any, value: string) => {
        if (value && value.length < 6 && value.length > 0) {
            return Promise.reject(new Error('Mật khẩu không ít hơn 6 ký tự'));
        }
        return Promise.resolve();
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const handleSuccess = async (credentialResponse: any) => {
        try {
            const result = await loginGoogle(credentialResponse.credential, dispatch, router);
            if (result === 'user invalid!') {
                toast.error('Người dùng đã tồn tại!', {
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
        } catch (error) {}
    };
    const handleError = () => {};
    return (
        <div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="container-form-login"
            >
                <ToastContainer />
                <div className="header-wrapper">
                    <div className="login-text">Đăng nhập</div>
                    <p className="login-description">Hoàn thành các thông tin chi tiết dưới đây</p>
                </div>

                <div className="form-item-custom">
                    <div className="title">Email hoặc tên tài khoản</div>
                    <Form.Item
                        name="usernameOrEmail"
                        rules={[{ required: true, message: 'Email hoặc tên tài khoản không được để trống' }]}
                    >
                        <Input
                            name="usernameOrEmail"
                            id="usernameOrEmail"
                            className="input-formik-global"
                            placeholder="Email hoặc tên tài khoản"
                        />
                    </Form.Item>
                </div>

                <div className="form-item-custom">
                    <div className="title">Mật khẩu</div>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Mật khẩu không được để trống' },
                            { validator: validatePassword },
                        ]}
                    >
                        <Input.Password
                            name="password"
                            id="password"
                            className="input-formik-global"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>
                </div>

                <div className="flex items-center justify-between xxxl:mb-2 float-right">
                    <div role="button" className="forgot-pass" onClick={switchToForgotPassword}>
                        Quên mật khẩu?
                    </div>
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    className="ant-btn-primary-custom p-2 inline-flex items-center justify-center rounded-md transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#1261a6] border-none font-semibold text-base h-11 w-full mb-4"
                >
                    Đăng nhập
                </Button>

                {/* <Button type="primary" className="btn-login-social" onClick={handleGoogleLogin}>
                    <Image alt="" src={icons.iconGg} />
                    <div className="ml-2">Đăng nhập với Google</div>
                </Button> */}
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} width={350} />
                <Button type="primary" className="btn-login-social">
                    <Image alt="" src={icons.iconFb} />
                    <div className="ml-2">Đăng nhập với Facebook</div>
                </Button>

                {/* <div className="ant-row flex justify-center mt-4">
                    <div className="text-res">Bạn chưa có tài khoản?</div>
                    <div role="button" className="text-router-register" onClick={switchToRegister}>
                        Đăng ký ngay
                    </div>
                </div> */}
            </Form>
        </div>
    );
}

export default LoginForm;
