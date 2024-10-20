'use client';
import { useState } from 'react';
import Image from 'next/image';
import { images } from '~/assets/images';
import './index.scss';
import { Form, Input, Modal } from 'antd';

function ChangePassword() {
    const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] = useState(false);

    const showModalChangePassword = () => {
        setIsModalChangePasswordOpen(true);
    };

    const handleOkChangePassword = () => {
        setIsModalChangePasswordOpen(false);
    };

    const handleCancelChangePassword = () => {
        setIsModalChangePasswordOpen(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="w-full hover:text-[#000]">
            <button
                type="button"
                className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] undefined"
                onClick={showModalChangePassword}
            >
                Đổi mật khẩu
            </button>
            <Modal
                title="Đổi mật khẩu"
                width={410}
                centered
                footer={null}
                open={isModalChangePasswordOpen}
                onOk={handleOkChangePassword}
                onCancel={handleCancelChangePassword}
                className="rounded-[10px] "
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className="ant-modal-content-ps"
                >
                    <div className="form-item-custom w-full">
                        <div className="title">
                            Mật khẩu mới<b className="text-red-600">*</b>
                        </div>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                        >
                            <Input.Password
                                name="password"
                                id="password"
                                className="input-formik-global !w-[362px]"
                                placeholder="Mật khẩu mới"
                            />
                        </Form.Item>
                    </div>
                    <div className="form-item-custom">
                        <div className="title">
                            Mật khẩu nhập lại<b className="text-red-600">*</b>
                        </div>
                        <Form.Item
                            name="changePassword"
                            rules={[{ required: true, message: 'Mật khẩu nhập lại không được để trống' }]}
                        >
                            <Input.Password
                                name="changePassword"
                                id="changePassword"
                                className="input-formik-global !w-[362px]"
                                placeholder="Mật khẩu nhập lại"
                            />
                        </Form.Item>
                    </div>
                    <button
                        className="p-2 inline-flex items-center justify-center rounded-md transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#2082ff] font-semibold text-base h-11 w-full mb-1.2"
                        type="submit"
                    >
                        Đổi mật khẩu
                    </button>
                </Form>
            </Modal>
        </div>
    );
}
export default ChangePassword;
