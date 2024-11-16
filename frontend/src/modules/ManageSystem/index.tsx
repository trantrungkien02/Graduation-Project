'use client';
import React from 'react';
import { Button, Form, Input, Select, Tabs } from 'antd';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createNotify, registerCourse } from '~/redux/stateglobal/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import axios from 'axios';
import { createAxios } from '~/app/createInstance';
import { logOutSuccess } from '~/redux/stateglobal/authSlice';
function ManageSystem() {
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const axiosJWT = createAxios(user, dispatch, logOutSuccess);

    const onFinish = async (values: any) => {
        try {
            // Thêm id của người dùng vào values
            const dataToSend = {
                ...values,
                senderId: user?._id,
                isGlobal: values.role === 'all' ? true : false,
            };
            console.log(dataToSend);
            const response = await createNotify(dataToSend, axiosJWT);
            console.log(response);

            if (typeof response === 'object') {
                toast.success('Thông báo đã được thêm thành công!', {
                    position: 'bottom-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'success',
                    transition: Bounce,
                });
                setTimeout(() => {
                    router.push('/');
                }, 5000);
            } else if (typeof response === 'string') {
                toast.error('Thông báo đã tồn tại!', {
                    position: 'bottom-right',
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
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error('Đã xảy ra lỗi khi thêm khóa học!', {
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
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };
    return (
        <div className="add-course-form-container">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                style={{ zIndex: 9999 }} // Tăng z-index lên
            />
            <h2 className="manage-title">Quản lý hệ thống</h2>
            <Tabs defaultActiveKey="1" className="pl-5 target-nav">
                <Tabs.TabPane tab={<div>Thêm thông báo</div>} key="1">
                    <Form
                        form={form}
                        name="add-course"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 12 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className="add-course-form"
                    >
                        <Form.Item
                            label="Tên thông báo"
                            name="tittle"
                            rules={[{ required: true, message: 'Tên thông báo không được để trống!' }]}
                        >
                            <Input placeholder="Nhập tên thông báo" />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="des"
                            rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả cho thông báo" />
                        </Form.Item>
                        <Form.Item
                            label="Người nhận"
                            name="role"
                            rules={[{ required: false, message: 'Người nhận không được để trống' }]}
                            initialValue="all"
                        >
                            <Select
                                showSearch
                                placeholder="Tất cả"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'all',
                                        label: 'Tất cả',
                                    },
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
                        <Button type="primary" htmlType="submit" className="ml-[300px]">
                            Thêm Thông báo
                        </Button>
                    </Form>
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Xem danh sách khóa học</div>} key="3"></Tabs.TabPane>
            </Tabs>
        </div>
    );
}

export default ManageSystem;
