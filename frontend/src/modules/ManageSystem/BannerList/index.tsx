import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Upload, message } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

interface Image {
    _id: string;
    url: string;
    title: string;
    description: string;
}

const BannerList: React.FC = () => {
    const [imageList, setImageList] = useState<Image[]>([]);
    const [isAddImageModalVisible, setIsAddImageModalVisible] = useState(false);
    const [isEditImageModalVisible, setIsEditImageModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState<Image | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    // Fetch images from the API
    const fetchImages = async () => {
        try {
            const response = await axios.get<Image[]>('http://localhost:8000/v1/banner/getallbanner');
            setImageList(response.data);
        } catch (err) {
            console.error('Error fetching images:', err);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Handle image upload to Cloudinary
    const handleImageUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'upload-file'); // Preset của Cloudinary

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
                setImageUrl(data.secure_url);
                message.success('Tải ảnh lên thành công!');
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

    // Add a new image
    const handleAddImage = async (values: Omit<Image, '_id'>) => {
        try {
            const payload = { ...values, url: imageUrl };
            const response = await axios.post<Image>('http://localhost:8000/v1/banner/create', payload);
            setImageList((prev) => [...prev, response.data]);
            setIsAddImageModalVisible(false);
            form.resetFields();
            setImageUrl(null);
            message.success('Thêm banner thành công!');
        } catch (err) {
            console.error('Error adding image:', err);
        }
    };

    // Save edited image
    const handleSaveImageEdit = async () => {
        try {
            const updatedValues = await form.validateFields();
            const payload = { ...updatedValues, url: imageUrl || currentImage?.url };
            if (currentImage) {
                const response = await axios.put<Image>(
                    `http://localhost:8000/v1/banner/update/${currentImage._id}`,
                    payload,
                );
                setImageList((prev) => prev.map((image) => (image._id === currentImage._id ? response.data : image)));
                setIsEditImageModalVisible(false);
                message.success('Sửa banner thành công!');
                form.resetFields();
                setImageUrl(null);
            }
        } catch (err) {
            console.error('Error editing image:', err);
        }
    };

    // Delete an image
    const handleDeleteImage = (id: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa ảnh này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8000/v1/banner/delete/${id}`);
                    setImageList((prev) => prev.filter((image) => image._id !== id));
                    message.success('Xóa ảnh thành công!');
                } catch (err) {
                    console.error('Error deleting image:', err);
                    message.error('Đã xảy ra lỗi khi xóa ảnh!');
                }
            },
            onCancel: () => {
                console.log('Hủy xóa ảnh');
            },
        });
    };

    // Table columns
    const columns = [
        {
            title: 'URL Ảnh',
            dataIndex: 'url',
            key: 'url',
            width: '30%',
            render: (url: string) => <img src={url} alt="image" style={{ width: '100px', height: '100px' }} />,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '35%',
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '15%',
            render: (_: any, record: Image) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => {
                            setCurrentImage(record);
                            setIsEditImageModalVisible(true);
                            form.setFieldsValue(record);
                        }}
                        style={{
                            backgroundColor: '#ffc107',
                            borderColor: '#ffc107',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '20px',
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteImage(record._id)}
                        style={{
                            backgroundColor: '#b80000',
                            borderColor: '#b80000',
                            borderRadius: '5px',
                            color: 'white',
                            marginLeft: '20px',
                        }}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setIsAddImageModalVisible(true)} style={{ marginBottom: '20px' }}>
                Thêm ảnh mới
            </Button>
            <Table
                columns={columns}
                dataSource={imageList}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 10 }}
            />

            {/* Add Image Modal */}
            <Modal
                title="Thêm ảnh mới"
                visible={isAddImageModalVisible}
                onOk={() => {
                    form.validateFields()
                        .then((values) => handleAddImage(values))
                        .catch((info) => console.log('Validate Failed:', info));
                }}
                onCancel={() => setIsAddImageModalVisible(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tải ảnh lên" name="url">
                        <Upload
                            customRequest={({ file }) => handleImageUpload(file as File)}
                            listType="picture"
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                                {uploading ? 'Đang tải lên...' : 'Chọn ảnh'}
                            </Button>
                        </Upload>
                        {imageUrl && (
                            <div style={{ marginTop: 8 }}>
                                <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Image Modal */}
            <Modal
                title="Chỉnh sửa ảnh"
                visible={isEditImageModalVisible}
                onOk={handleSaveImageEdit}
                onCancel={() => setIsEditImageModalVisible(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tải ảnh lên" name="url">
                        <Upload
                            customRequest={({ file }) => handleImageUpload(file as File)}
                            listType="picture"
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                                {uploading ? 'Đang tải lên...' : 'Chọn ảnh'}
                            </Button>
                        </Upload>
                        {(imageUrl || currentImage?.url) && (
                            <div style={{ marginTop: 8 }}>
                                <img
                                    src={imageUrl || currentImage?.url}
                                    alt="Uploaded"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BannerList;
