'use client';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import './index.scss';
import { useRouter } from 'next/navigation';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { registerUser } from '~/redux/stateglobal/apiRequest';
import { useDispatch } from 'react-redux';

interface FormProps {
    switchToRegister?: () => void;
    switchToLogin?: () => void;
}

interface FormData {
    username: string;
    email: string;
    password: string;
    role: string;
    comparePassword?: string; // Đặt tùy chọn vì sẽ loại bỏ sau
}
function RegisterForm() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const dispatch = useDispatch();
    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };
    const onFinish = async (values: FormData) => {
        console.log('Form Values:', values);

        try {
            // const response = await fetch('https://api.tinamys.com/api/v1/auth/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(values),
            // });
            // console.log(values);
            // if (response.ok) {
            //     const result = await response.json();
            //     if (result.success && result.errorCode == '000000') {
            //         router.push('/login');
            //     } else if (result.errorCode == 'USER.USERNAME_EXISTED') {
            //         toast.error('Tên tài khoản đã tồn tại!', {
            //             position: 'top-right',
            //             autoClose: 5000,
            //             hideProgressBar: false,
            //             closeOnClick: true,
            //             pauseOnHover: true,
            //             draggable: true,
            //             progress: undefined,
            //             theme: 'light',
            //             transition: Bounce,
            //         });
            //     } else {
            //         toast.error('Email đã tồn tại!', {
            //             position: 'top-right',
            //             autoClose: 5000,
            //             hideProgressBar: false,
            //             closeOnClick: true,
            //             pauseOnHover: true,
            //             draggable: true,
            //             progress: undefined,
            //             theme: 'light',
            //             transition: Bounce,
            //         });
            //     }
            // } else {
            //     console.error('Error:', response.statusText);
            // }
            const { comparePassword, ...formData } = values;
            console.log(formData);
            const res = await registerUser(formData, dispatch);
            console.log(res);
            if (res == 'Username already exists') {
                toast.error('Tên tài khoản đã tồn tại!', {
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
            } else if (res == 'Email already exists') {
                toast.error('Email đã tồn tại!', {
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
            } else {
                router.push('login');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };
    const switchToLogin = () => {
        router.push('/login');
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const validatePassword = async (_: any, value: string) => {
        if (value && value.length < 6) {
            return Promise.reject(new Error('Mật khẩu mới không ít hơn 6 ký tự'));
        }
        if (value && value !== form.getFieldValue('password')) {
            return Promise.reject(new Error('Mật khẩu nhập lại không khớp'));
        }
        return Promise.resolve();
    };
    return (
        <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true, role: '1' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="container-form-login"
        >
            <ToastContainer />
            <div className="header-wrapper">
                <div className="login-text mb-8">ĐĂNG KÝ</div>
            </div>
            {/* <div className="form-item-custom">
                <div className="title">
                    Họ và tên
                    <b className="text-red-600">*</b>
                </div>
                <Form.Item name="fullName" rules={[{ required: true, message: 'Họ và tên không được để trống' }]}>
                    <Input name="fullName" id="fullName" className="input-formik-global" placeholder="Họ và tên" />
                </Form.Item>
            </div> */}

            <div className="form-item-custom">
                <div className="title">
                    Tên tài khoản
                    <b className="text-red-600">*</b>
                </div>
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: 'Tên tài khoản không được để trống' },
                        { min: 6, message: 'Tên tài khoản không ít hơn 6 ký tự' },
                    ]}
                >
                    <Input name="username" id="username" className="input-formik-global" placeholder="Tên tài khoản" />
                </Form.Item>
            </div>
            <div className="form-item-custom">
                <div className="title">
                    Email
                    <b className="text-red-600">*</b>
                </div>
                <Form.Item
                    name="email"
                    validateTrigger={['onBlur', 'onChange']}
                    rules={[
                        { required: true, message: 'Email không được để trống' },
                        {
                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Email không hợp lệ',
                        },
                    ]}
                >
                    <Input name="email" id="email" className="input-formik-global" placeholder="Email" />
                </Form.Item>
            </div>
            <div className="form-item-custom">
                <div className="title">
                    Vai trò của bạn là:
                    <b className="text-red-600">*</b>
                </div>
                <Form.Item name="role" rules={[{ required: false, message: 'Tên tài khoản không được để trống' }]}>
                    <Select
                        showSearch
                        placeholder="Học viên"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
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
            </div>
            <div className="form-item-custom ">
                <div className="title">
                    Mật khẩu
                    <b className="text-red-600">*</b>
                </div>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Mật khẩu không được để trống' },
                        { min: 6, message: 'Mật khẩu mới không ít hơn 6 ký tự không được để trống' },
                    ]}
                >
                    <Input.Password
                        name="password"
                        id="password"
                        value="pasword"
                        className="input-formik-global"
                        placeholder="Mật khẩu"
                    />
                </Form.Item>
            </div>
            <div className="form-item-custom">
                <div className="title">
                    Nhập lại mật khẩu
                    <b className="text-red-600">*</b>
                </div>
                <Form.Item
                    name="comparePassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Nhập lại mật khẩu không được để trống' },
                        { validator: validatePassword },
                    ]}
                >
                    <Input.Password
                        name="comparePassword"
                        id="comparePassword"
                        className="input-formik-global"
                        placeholder="Nhập lại mật khẩu"
                    />
                </Form.Item>
            </div>

            <Button
                type="primary"
                htmlType="submit"
                className="ant-btn-primary-custom p-2 inline-flex items-center justify-center rounded-md transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#1261a6] border-none font-semibold text-base h-11 w-full mb-1.2"
            >
                ĐĂNG KÝ
            </Button>

            {/* <div className="ant-row flex justify-center mt-4">
                <div className="text-res">Bạn đã có tài khoản?</div>
                <div role="button" className="text-router-register" onClick={switchToLogin}>
                    Đăng nhập ngay
                </div>
            </div> */}
            {/* <button type="button" className="btn-back-page btn-position" onClick={switchToLogin}>
                <span role="img" aria-label="arrow-left" className="anticon anticon-arrow-left">
                    <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="arrow-left"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                    </svg>
                </span>
            </button> */}
        </Form>
    );
}

export default RegisterForm;
