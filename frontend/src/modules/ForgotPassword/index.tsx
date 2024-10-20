'use client';
import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
import Image from 'next/image';
import './index.scss';
import { icons } from '~/assets/images/icons/icons';
import ReCAPTCHA from 'react-google-recaptcha';

interface FormProps {
    switchToRegister?: () => void;
    switchToLogin?: () => void;
    switchToForgotPassword?: () => void;
}
function ForgotPassword({ switchToLogin }: FormProps) {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="container-form-login max-w-lg h-fit mb-[260px] relative"
        >
            <div className="header-wrapper">
                <div className="login-text">Quên mật khẩu</div>
                <p className="login-description">
                    Nhập địa chỉ email bạn đã sử dụng khi tham gia và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật
                    khẩu.
                </p>
            </div>
            <div className="form-item-custom">
                <div className="title">
                    Email
                    <span className="text-red-600">*</span>
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
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} className="mb-5 absolute right-[50px]" />
            <Button
                type="primary"
                htmlType="submit"
                className="p-2 inline-flex items-center justify-center rounded-md transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#2082ff] font-semibold text-base h-11 w-full mb-1.2 mt-[110px]"
            >
                Tiếp theo
            </Button>
            <button type="button" className="btn-back-page btn-position" onClick={switchToLogin}>
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
            </button>
        </Form>
    );
}

export default ForgotPassword;
