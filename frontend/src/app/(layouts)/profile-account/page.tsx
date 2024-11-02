'use client';
import React from 'react';
import Image from 'next/image';
import './profileAccount.scss';
import { Form, Input, message } from 'antd'; // Thêm message để hiển thị thông báo
import { useSelector, useDispatch } from 'react-redux';
import { images } from '~/assets/images';
import { updateUser } from '~/redux/stateglobal/apiRequest'; // Gọi hàm API cập nhật người dùng

type Props = {};

const ProfilePage = (props: Props) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.login?.currentUser);

    const onFinish = async (values: any) => {
        try {
            // Gọi hàm updateUser và truyền dữ liệu form
            const res = await updateUser(values, dispatch);
            console.log(values);
            // Nếu cập nhật thành công, cập nhật lại form với dữ liệu mới

            // Hiển thị thông báo thành công
            if (res === 'User not found') {
                message.error('Không tìm thấy người dùng!');
            } else if (res === 'Username already in use') {
                message.error('Tên người dùng đã tồn tại, vui lòng chọn tên khác!');
            } else if (res === 'Incorrect old password') {
                message.error('Mật khẩu cũ không chính xác!');
            } else {
                message.success('Thông tin đã được cập nhật thành công!');
                form.setFieldsValue({
                    username: res.username,
                    email: res.email,
                    password: '',
                    oldpassword: '',
                });
            }
        } catch (error: any) {
            return error;
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="edit-account">
            <div className="title-edit-account">
                <h3>Thông tin tài khoản</h3>
            </div>
            <div className="form-bg-avatar">
                <div className="inline-block relative top-[62px] pl-10">
                    <div className="upload-image">
                        <Image alt="" src={images.avtUser} className="image-user" />
                    </div>
                </div>
            </div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                    username: user?.username,
                    email: user?.email,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="form-edit-account"
            >
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
                        <Input
                            name="username"
                            id="username"
                            className="input-formik-global-profile"
                            defaultValue={user?.username}
                        />
                    </Form.Item>
                </div>

                <div className="form-item-custom">
                    <div className="title">Email</div>
                    <Form.Item name="email" rules={[{ required: true, message: 'Email không được để trống' }]}>
                        <Input
                            name="email"
                            id="email"
                            className="input-formik-global-profile"
                            defaultValue={user?.email}
                            disabled
                        />
                    </Form.Item>
                </div>

                <div className="form-item-custom">
                    <div className="title">
                        Mật khẩu cũ
                        <b className="text-red-600">*</b>
                    </div>

                    <Form.Item
                        name="oldpassword"
                        rules={[{ required: true, message: 'Mật khẩu cũ không được để trống' }]}
                    >
                        <Input.Password
                            name="oldpassword"
                            id="oldpassword"
                            className="input-formik-global-profile"
                            placeholder="Nhập mật khẩu cũ"
                        />
                    </Form.Item>
                </div>

                <div className="form-item-custom">
                    <div className="title">Mật khẩu mới</div>
                    <Form.Item name="password" rules={[{ required: false, message: 'Mật khẩu không được để trống' }]}>
                        <Input.Password
                            name="password"
                            id="password"
                            className="input-formik-global-profile"
                            placeholder="Nhập mật khẩu mới"
                        />
                    </Form.Item>
                </div>

                <div className="flex justify-end mb-5">
                    <button
                        className="p-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#1c7fff] h-12 py-3 px-6"
                        type="submit"
                    >
                        Lưu thông tin
                    </button>
                </div>
            </Form>
        </div>
    );
};

export default ProfilePage;
