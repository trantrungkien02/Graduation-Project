'use client';
import React from 'react';
import { Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerCourse } from '~/redux/stateglobal/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
function AddCourseForm() {
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const onFinish = async (values: any) => {
        try {
            // Thêm id của người dùng vào values
            const dataToSend = {
                ...values,
                userId: user?._id, // Giả sử user ID nằm trong _id của user
            };
            console.log(dataToSend);
            const response = await registerCourse(dataToSend, dispatch);
            console.log(response);

            if (typeof response === 'object') {
                toast.success('Khóa học đã được thêm thành công!', {
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
                toast.error('Khóa học đã tồn tại!', {
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
            <h2 className="course-title">Thêm Khóa Học</h2>
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
                    label="Tên khóa học"
                    name="name"
                    rules={[{ required: true, message: 'Tên khóa học không được để trống!' }]}
                >
                    <Input placeholder="Nhập tên khóa học" />
                </Form.Item>

                <Form.Item label="Mô tả" name="des" rules={[{ required: true, message: 'Mô tả không được để trống!' }]}>
                    <Input.TextArea rows={4} placeholder="Nhập mô tả cho khóa học" />
                </Form.Item>

                <Form.Item
                    label="Ảnh đại diện khóa học"
                    name="image"
                    rules={[{ required: true, message: 'Ảnh đại diện khóa học không được để trống!' }]}
                >
                    <Input placeholder="Nhập url của ảnh" />
                </Form.Item>

                <Form.Item
                    label="Video Trailer"
                    name="videoId"
                    rules={[{ required: true, message: 'Video Trailer không được để trống!' }]}
                >
                    <Input placeholder="Nhập Video ID" />
                </Form.Item>

                <Form.Item
                    label="Cấp độ"
                    name="level"
                    rules={[{ required: true, message: 'Cấp độ không được để trống!' }]}
                >
                    <Input placeholder="Nhập cấp độ khóa học" />
                </Form.Item>

                <Form.Item
                    label="Giá tiền"
                    name="price"
                    initialValue="Miễn phí"
                    rules={[{ required: true, message: 'Giá tiền không được để trống!' }]}
                >
                    <Input placeholder="Nhập giá tiền khóa học" />
                </Form.Item>

                <Button type="primary" htmlType="submit" className="ml-[300px]">
                    Thêm Khóa Học
                </Button>
            </Form>
        </div>
    );
}

export default AddCourseForm;
