'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './index.scss';
import { Avatar, Button, Descriptions, Form, Input, message, Modal, Tabs, Upload } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { images } from '~/assets/images';
import { updateUser } from '~/redux/stateglobal/apiRequest';
import { useRouter } from 'next/navigation';
import { createAxios } from '~/app/createInstance';
import { loginCourseForUserSuccess, loginSuccess } from '~/redux/stateglobal/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

interface UserInfo {
    fullName?: string;
    bio?: string;
    avatar?: string;
    headerImage?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
}

const MyProfile = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalField, setModalField] = useState<
        | 'fullName'
        | 'username'
        | 'bio'
        | 'address'
        | 'courseCount'
        | 'studentCount'
        | 'avatar'
        | 'headerImage'
        | 'github'
        | 'facebook'
        | 'tiktok'
    >('fullName');
    const [activeKey, setActiveKey] = useState('1');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(userInfo?.avatar || userInfo?.headerImage || '');
    const [imageField, setImageField] = useState('');
    // Hàm bật modal
    const showModal = (field: 'avatar' | 'headerImage') => {
        setImageField(field);
        setModalField(field); // Set the field to update (avatar or header)
        setImageUrl(userInfo?.[field] || '');
        setIsAvatarModalOpen(true);
    };

    // Hàm tắt modal
    const handleCloseModal = () => {
        setIsAvatarModalOpen(false);
    };

    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        const userData = { username: user?.username, email: user?.email };

        const fetchUserInfo = async () => {
            try {
                const response = await axiosJWT.get('http://localhost:8000/v1/user/getinfo', {
                    params: userData, // Hoặc dùng axios.post nếu API cần body
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo(); // Gọi hàm fetch dữ liệu
    }, []);

    const onFinish = async (values: any) => {
        try {
            const { oldpassword, password } = values;

            // Gửi yêu cầu đổi mật khẩu
            const res = await updateUser(
                {
                    username: user?.username,
                    email: user?.email,
                    oldpassword,
                    password,
                },
                dispatch,
            );
            console.log(values);

            if (res === 'User not found') {
                message.error('Không tìm thấy người dùng!');
            } else if (res === 'Username already in use') {
                message.error('Tên người dùng đã tồn tại, vui lòng chọn tên khác!');
            } else if (res === 'Incorrect old password') {
                message.error('Mật khẩu hiện tại không chính xác!');
            } else {
                message.success('Mật khẩu đã được cập nhật thành công!');
                form.setFieldsValue({
                    oldpassword: '',
                    password: '',
                    confirmPassword: '',
                });
            }
        } catch (error: any) {
            return error;
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };
    const handleOpenModal = (field: any, value: any) => {
        setModalField(field);
        form.setFieldsValue({ [field]: value });
        setIsModalOpen(true);
    };
    const handleSave = async () => {
        try {
            const values: Record<string, any> = form.getFieldsValue();
            const safeModalField = modalField ?? ''; // Gán giá trị mặc định nếu null
            const fieldToUpdate = { [safeModalField]: values[safeModalField] };

            // Tạo payload với dữ liệu cần gửi
            const payload = {
                username: user?.username,
                email: user?.email,
                ...fieldToUpdate,
            };

            // Gửi yêu cầu API
            const response = await axiosJWT.put('http://localhost:8000/v1/user/updateinfo', payload);

            // Xử lý phản hồi từ server
            if (response.status === 200) {
                message.success('Cập nhật thông tin thành công!');
                dispatch(loginCourseForUserSuccess(response.data));
                setIsModalOpen(false);

                // Cập nhật dữ liệu hiển thị
                setUserInfo((prev) => ({
                    ...prev,
                    ...fieldToUpdate,
                }));
            } else {
                message.error('Cập nhật không thành công!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };
    const handleUpload = async (file: File) => {
        try {
            setUploading(true);

            // Tạo FormData để upload lên Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'upload-file'); // Upload preset trong Cloudinary

            // Gửi yêu cầu đến Cloudinary
            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                },
            );

            const cloudinaryData = await cloudinaryResponse.json();

            // Kiểm tra nếu upload thành công
            if (cloudinaryData.secure_url) {
                // Cập nhật URL trả về vào `userInfo`
                setUserInfo((prev) => ({
                    ...prev,
                    [imageField]: cloudinaryData.secure_url,
                }));

                // Gửi URL đến API của bạn để cập nhật ảnh đại diện
                const apiResponse = await axiosJWT.put('http://localhost:8000/v1/user/updateinfo', {
                    username: user.username,
                    email: user.email,
                    [imageField]: cloudinaryData.secure_url, // URL ảnh đại diện
                });

                if (apiResponse.status === 200) {
                    dispatch(loginCourseForUserSuccess(apiResponse.data));

                    message.success('Cập nhật ảnh đại diện thành công!');
                    setIsAvatarModalOpen(false); // Đóng modal
                } else {
                    throw new Error('Cập nhật ảnh thất bại!');
                }
            } else {
                throw new Error('Tải ảnh lên Cloudinary thất bại!');
            }
        } catch (error) {
            console.error('Upload avatar error:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setUploading(false); // Tắt trạng thái loading
        }
    };

    const fieldLabels: { [key: string]: string } = {
        fullName: 'Họ và tên',
        username: 'Tên người dùng',
        bio: 'Giới thiệu',
        address: 'Địa chỉ',
        courseCount: 'Số khóa học',
        studentCount: 'Số sinh viên',
        avatar: 'Ảnh đại diện',
        github: 'GitHub',
        facebook: 'Facebook',
        tiktok: 'Tiktok',
    };
    return (
        <div>
            <Tabs defaultActiveKey="1" className="pl-5 target-nav" onChange={handleTabChange}>
                <Tabs.TabPane tab={<div>Thông tin cá nhân</div>} key="1">
                    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
                        <p className="text-gray-600 mb-6">Quản lý thông tin cá nhân của bạn.</p>

                        {/* Thông tin cơ bản */}
                        <section className="mb-8">
                            <div className="border border-gray-300 rounded-lg">
                                <div
                                    className="flex justify-between items-center border-b border-gray-300 p-4 cursor-pointer"
                                    onClick={() => handleOpenModal('fullName', userInfo?.fullName)}
                                >
                                    <span className="font-semibold text-gray-700">Họ và tên</span>
                                    <span className="text-gray-500">{userInfo?.fullName || 'Chưa cập nhật'}</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div
                                    className="flex justify-between items-center border-b border-gray-300 p-4 cursor-pointer"
                                    onClick={() => handleOpenModal('username', user?.username)}
                                >
                                    <span className="font-semibold text-gray-700">Tên người dùng</span>
                                    <span className="text-gray-500">{user?.username}</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div
                                    className="flex justify-between items-center border-b border-gray-300 p-4 cursor-pointer"
                                    onClick={() => handleOpenModal('bio', userInfo?.bio)}
                                >
                                    <span className="font-semibold text-gray-700">Giới thiệu</span>
                                    <span className="text-gray-500">{userInfo?.bio || 'Chưa cập nhật'}</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div
                                    className="flex justify-between items-center border-b border-gray-300 p-4 cursor-pointer"
                                    onClick={() => showModal('avatar')}
                                >
                                    <span className="font-semibold text-gray-700">Ảnh đại diện</span>
                                    <span>
                                        {userInfo?.avatar ? (
                                            <Avatar size={100} src={userInfo.avatar} />
                                        ) : (
                                            <span className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                ?
                                            </span>
                                        )}
                                    </span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div
                                    className="flex justify-between items-center  p-4 cursor-pointer"
                                    onClick={() => showModal('headerImage')}
                                >
                                    <span className="font-semibold text-gray-700">Ảnh bìa</span>
                                    <span>
                                        {userInfo?.headerImage ? (
                                            <Image
                                                src={userInfo.headerImage}
                                                alt="Header"
                                                width={200}
                                                height={200}
                                                className="rounded-lg"
                                            />
                                        ) : (
                                            <span className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                                                ?
                                            </span>
                                        )}
                                    </span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <Modal
                                    title={`Cập nhật ${modalField === 'avatar' ? 'ảnh đại diện' : 'ảnh bìa'}`}
                                    visible={isAvatarModalOpen}
                                    onCancel={handleCloseModal}
                                    footer={null}
                                >
                                    <Upload
                                        name={modalField}
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            handleUpload(file); // Gọi hàm upload khi chọn file
                                            return false; // Ngăn mặc định upload của trình duyệt
                                        }}
                                        className="w-[200px] h-[200px]"
                                    >
                                        {uploading ? (
                                            <div className="flex flex-col items-center">
                                                <LoadingOutlined style={{ fontSize: 24 }} />
                                                <span>Đang tải...</span>
                                            </div>
                                        ) : imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={modalField}
                                                width={200}
                                                height={200}
                                                style={{ objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <div>
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        )}
                                    </Upload>
                                </Modal>
                            </div>
                        </section>

                        {/* Thông tin mạng xã hội */}
                        <section>
                            <div className="border border-gray-300 rounded-lg">
                                <div
                                    className="flex justify-between items-center border-b border-gray-300 p-4 cursor-pointer"
                                    onClick={() => handleOpenModal('github', userInfo?.github)}
                                >
                                    <span className="font-semibold text-gray-700">GitHub</span>
                                    <span className="text-gray-500">{userInfo?.github || 'Chưa cập nhật'}</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div
                                    className="flex justify-between items-center border-b border-gray-300 p-4 cursor-pointer"
                                    onClick={() => handleOpenModal('facebook', userInfo?.facebook)}
                                >
                                    <span className="font-semibold text-gray-700">Facebook</span>
                                    <span className="text-gray-500">{userInfo?.facebook || 'Chưa cập nhật'}</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div
                                    className="flex justify-between items-center p-4 cursor-pointer"
                                    onClick={() => handleOpenModal('youtube', userInfo?.youtube)}
                                >
                                    <span className="font-semibold text-gray-700">YouTube</span>
                                    <span className="text-gray-500">{userInfo?.youtube || 'Chưa cập nhật'}</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>
                        </section>

                        {/* Modal */}
                        <Modal
                            title={`Cập nhật ${
                                modalField === 'fullName'
                                    ? 'họ và tên'
                                    : modalField === 'username'
                                      ? 'tên người dùng'
                                      : modalField === 'bio'
                                        ? 'giới thiệu'
                                        : modalField === 'github'
                                          ? 'GitHub'
                                          : modalField === 'facebook'
                                            ? 'Facebook'
                                            : 'YouTube'
                            }`}
                            open={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            footer={[
                                <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                                    Hủy
                                </Button>,
                                <Button key="save" type="primary" onClick={handleSave}>
                                    Lưu lại
                                </Button>,
                            ]}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    label={fieldLabels[modalField] ?? ''}
                                    name={modalField}
                                    rules={[{ required: true, message: 'Vui lòng nhập thông tin!' }]}
                                >
                                    {modalField === 'bio' ? (
                                        <TextArea placeholder={`Nhập ${modalField}`} />
                                    ) : (
                                        <Input placeholder={`Nhập ${modalField}`} />
                                    )}
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div>Bảo mật thông tin</div>} key="3">
                    <div className="edit-account">
                        <div className="title-edit-account">
                            <h3>Đổi mật khẩu</h3>
                        </div>
                        <Form
                            form={form}
                            name="change-password"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            className="form-edit-account"
                        >
                            <div className="form-item-custom">
                                <div className="title">
                                    Mật khẩu hiện tại
                                    <b className="text-red-600">*</b>
                                </div>
                                <Form.Item
                                    name="oldpassword"
                                    rules={[{ required: true, message: 'Mật khẩu hiện tại không được để trống' }]}
                                >
                                    <Input.Password
                                        name="oldpassword"
                                        id="oldpassword"
                                        className="input-formik-global-profile"
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                </Form.Item>
                            </div>

                            <div className="form-item-custom">
                                <div className="title">
                                    Mật khẩu mới
                                    <b className="text-red-600">*</b>
                                </div>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Mật khẩu không được để trống' },
                                        { min: 6, message: 'Mật khẩu mới không ít hơn 6 ký tự' },
                                    ]}
                                >
                                    <Input.Password
                                        name="password"
                                        id="password"
                                        className="input-formik-global-profile"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </Form.Item>
                            </div>

                            <div className="form-item-custom">
                                <div className="title">
                                    Xác nhận mật khẩu
                                    <b className="text-red-600">*</b>
                                </div>
                                <Form.Item
                                    name="confirmPassword"
                                    rules={[
                                        { required: true, message: 'Xác nhận mật khẩu không được để trống' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Mật khẩu không trùng khớp!');
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        className="input-formik-global-profile"
                                        placeholder="Xác nhận mật khẩu mới"
                                    />
                                </Form.Item>
                            </div>

                            <div className="flex justify-end mb-5">
                                <button
                                    className="p-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#1c7fff] h-12 py-3 px-6"
                                    type="submit"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </Form>
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default MyProfile;
