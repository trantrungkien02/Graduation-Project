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
    comparePassword?: string;
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
        </Form>
    );
}

export default RegisterForm;
