import { useEffect, useState } from 'react';
import { Modal, Button, Radio, Form, Input, message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';

const PaymentFormModal = (course: any) => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const [form] = Form.useForm();
    const router = useRouter();
    const courseData = course.course;

    const handleSubmit = async (values: any) => {
        // 1. In thông tin đã được submit
        console.log('Submitted values:', values);

        const { senderUser, receiveUser, ...remainingValues } = values;
        console.log(remainingValues);

        // 2. Cập nhật giá trị amount với giá trị của khóa học
        const updatedValues = {
            ...remainingValues,
            amount: courseData?.price || 0, // Gán giá trị courseData?.price hoặc mặc định là 0
        };

        // 3. Gửi yêu cầu API để lấy URL thanh toán (vẫn giữ logic ban đầu)
        axios
            .post('http://localhost:8000/v1/order/create_payment_url', updatedValues)
            .then((response) => {
                const url = response.data;
                console.log(url);

                if (url) {
                    router.push(url); // Chuyển hướng trình duyệt đến trang thanh toán
                } else {
                    console.error('No URL returned from backend');
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ bankCode: 'VNBANK', language: 'vn' }}
            >
                <div className="pr-[50px] pl-[40px]">
                    <h4 className="mt-[16px] mb-[28px] text-[#555]">
                        <FontAwesomeIcon icon={faCreditCard} /> Thanh toán
                    </h4>
                    <Form.Item name="courseName" label="Khóa học">
                        <Input defaultValue={courseData?.name} readOnly />
                    </Form.Item>
                    <Form.Item name="senderUser" label="Người thanh toán">
                        <Input defaultValue={user?.username} readOnly />
                    </Form.Item>
                    <Form.Item name="receiveUser" label="Người nhận (Giảng viên khóa học)">
                        <Input defaultValue={courseData?.userName} readOnly />
                    </Form.Item>

                    <Form.Item name="amount" label="Số tiền">
                        <Input defaultValue={courseData?.price} readOnly />
                    </Form.Item>

                    <Form.Item
                        name="bankCode"
                        label="Chọn Phương thức thanh toán (Ưu tiên thanh toán qua ATM-Tài khoản ngân hàng nội địa)"
                        rules={[{ required: false, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                    >
                        <Radio.Group>
                            <Radio value="VNBANK">Thanh toán qua ATM-Tài khoản ngân hàng nội địa</Radio>
                            <Radio value="">Cổng thanh toán VNPAYQR</Radio>
                            <Radio value="VNPAYQR">Thanh toán qua ứng dụng hỗ trợ VNPAYQR</Radio>
                            <Radio value="INTCARD">Thanh toán qua thẻ quốc tế</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="language"
                        label="Ngôn ngữ"
                        rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ!' }]}
                    >
                        <Radio.Group>
                            <Radio value="vn">Tiếng Việt</Radio>
                            <Radio value="en">Tiếng Anh</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="rounded-[5px]">
                            Thanh toán
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    );
};

export default PaymentFormModal;
