'use client';
import React, { useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Spin, Tabs, Upload } from 'antd';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerCourse } from '~/redux/stateglobal/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import './index.scss';
import CourseListById from './CourseListById';
import { UploadOutlined } from '@ant-design/icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function ManageCourse() {
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const [uploading, setUploading] = useState(false); // Để hiển thị trạng thái upload
    const [imageUrl, setImageUrl] = useState(''); // Lưu URL trả về từ Cloudinary
    const [activeKey, setActiveKey] = useState('1');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleTabChange = (key: string) => {
        setActiveKey(key);
        if (key === '1') {
            setImageUrl(''); // Set imageUrl thành chuỗi rỗng khi tab "Thêm khóa học" được chọn
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'upload-file'); // Upload preset được cấu hình trong Cloudinary

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                },
            );

            const data = await res.json();
            if (data.secure_url) {
                setImageUrl(data.secure_url); // Lưu URL trả về
                message.success('Tải ảnh lên thành công!');
                return data;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Đã xảy ra lỗi khi tải ảnh lên!');
        } finally {
            setUploading(false);
        }
    };
    type Level = 'beginner' | 'intermediate' | 'advanced';

    const levelMapping: Record<Level, string> = {
        beginner: 'Cơ bản',
        intermediate: 'Trung cấp',
        advanced: 'Nâng cao',
    };
    const onFinish = async (values: any) => {
        try {
            // Thêm id của người dùng vào values
            const dataToSend = {
                ...values,
                level: levelMapping[values.level as Level],
                image: imageUrl, // URL từ Cloudinary
                userId: user?._id,
                userName: user?.username,
            };
            console.log(dataToSend);
            const response = await registerCourse(dataToSend, dispatch);
            console.log(response);

            if (typeof response === 'object') {
                toast.success('Khóa học của bạn sẽ được thêm khi được hệ thống xét duyệt!', {
                    position: 'bottom-right',
                    autoClose: 3000,
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
                }, 3000);
            } else if (typeof response === 'string') {
                toast.error('Khóa học đã tồn tại!', {
                    position: 'bottom-right',
                    autoClose: 3000,
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
                autoClose: 3000,
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
            <h2 className="manage-title">Quản lý khóa Học</h2>
            <Tabs defaultActiveKey="1" className="pl-5 target-nav" onChange={handleTabChange}>
                <Tabs.TabPane tab={<div>Thêm khóa học</div>} key="1">
                    <div onClick={showModal} className="text-red-600 ml-[300px] mb-[30px] text-[16px]">
                        Lưu ý khi thêm bài giảng
                    </div>
                    <Modal
                        title="Lưu ý khi thêm bài giảng"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Đã hiểu"
                        cancelText="Hủy"
                    >
                        <ul>
                            <li>1. Tên và mô tả bài giảng rõ ràng, dễ hiểu.</li>
                            <li>2. Video chất lượng cao, đúng định dạng.</li>
                            <li>3. Cung cấp tài liệu hỗ trợ nếu có.</li>
                            <li>4. Sắp xếp bài học theo thứ tự logic.</li>
                            <li>5. Đặt giá hợp lý, thêm khuyến mãi nếu cần..</li>
                            <li>6. Kiểm tra thông tin trước khi lưu.</li>
                            <li>7. Chờ Admin phê duyệt trước khi xuất bản.</li>
                        </ul>
                    </Modal>
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

                        <Form.Item
                            label="Mô tả"
                            name="des"
                            rules={[{ required: true, message: 'Mô tả không được để trống!' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả cho khóa học" />
                        </Form.Item>

                        <Form.Item
                            label="Ảnh đại diện khóa học"
                            name="image"
                            rules={[{ required: false, message: 'Ảnh đại diện khóa học không được để trống!' }]}
                        >
                            <Upload
                                beforeUpload={(file) => {
                                    handleImageUpload(file);
                                    return false; // Ngăn upload tự động
                                }}
                                maxCount={1} // Chỉ upload 1 file
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                            {uploading && (
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="text-[30px] mt-[5px] text-[#555] hover:text-[#0b3a82] motion-preset-spin "
                                />
                            )}
                            {imageUrl && (
                                <img src={imageUrl} alt="Uploaded" style={{ marginTop: 10, width: '100px' }} />
                            )}
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
                            <Select placeholder="Chọn cấp độ khóa học">
                                <Select.Option value="beginner">Cơ bản</Select.Option>
                                <Select.Option value="intermediate">Trung cấp</Select.Option>
                                <Select.Option value="advanced">Nâng cao</Select.Option>
                            </Select>
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
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Xem danh sách khóa học</div>} key="3">
                    <CourseListById uploadImage={handleImageUpload} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
}

export default ManageCourse;
