import { useEffect, useState } from 'react';
import { Modal, Button, Radio, Form, Input, message, Select, DatePicker } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { getCoursesAdsSuccess } from '~/redux/stateglobal/courseSlice';

const PaymentForAdsCourse = (course: any) => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const [startDate, setStartDate] = useState(moment()); // Lấy thời gian hiện tại
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const courseData = course.course;

    const handleSubmit = async (values: any) => {
        // 1. In thông tin đã được submit
        console.log('Submitted values:', values);
        const updatedCourse = {
            ...course,
            startDate: values.startDate.format('YYYY-MM-DD'),
            endDate: values.endDate.format('YYYY-MM-DD'),
        };
        dispatch(getCoursesAdsSuccess(updatedCourse));
        console.log(updatedCourse);
        const { senderUser, receiveUser, ...remainingValues } = values;
        console.log(remainingValues);

        // 2. Cập nhật giá trị amount với giá trị của khóa học
        // const updatedValues = {
        //     ...remainingValues,
        //     amount: courseData?.price || 0, // Gán giá trị courseData?.price hoặc mặc định là 0
        // };

        // 3. Gửi yêu cầu API để lấy URL thanh toán (vẫn giữ logic ban đầu)
        axios
            .post('http://localhost:8000/v1/order/create_payment_url', remainingValues)
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

    const handleEndDateChange = (endDate: any) => {
        if (!endDate) return;

        const diffDays = endDate.diff(startDate, 'days') + 1; // Tính số ngày quảng cáo
        const totalAmount = diffDays * 20000; // Tính số tiền
        form.setFieldsValue({ amount: totalAmount }); // Cập nhật số tiền
    };
    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ bankCode: 'VNBANK', language: 'vn', startDate: startDate }}
            >
                <div className="pr-[50px] pl-[40px]">
                    <h4 className="mt-[16px] mb-[28px] text-[#555]">
                        <FontAwesomeIcon icon={faCreditCard} /> Thanh toán quảng cáo khóa học
                    </h4>
                    <Form.Item name="courseName" label="Khóa học">
                        <Input defaultValue={courseData?.name} readOnly />
                    </Form.Item>
                    <Form.Item name="senderUser" label="Người thanh toán">
                        <Input defaultValue={user?.username} readOnly />
                    </Form.Item>
                    <Form.Item name="receiveUser" label="Người nhận (Admin hệ thống)">
                        <Input defaultValue={'Admin'} readOnly />
                    </Form.Item>

                    <Form.Item label="Ngày bắt đầu" name="startDate">
                        <DatePicker defaultValue={startDate} disabled format="YYYY-MM-DD" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                            {
                                validator: (_, value) => {
                                    if (value && value.isBefore(startDate, 'day')) {
                                        return Promise.reject('Ngày kết thúc không được trước ngày bắt đầu!');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={handleEndDateChange} // Cập nhật số tiền khi thay đổi ngày kết thúc
                            disabledDate={(current) => current && current.isBefore(startDate, 'day')} // Chặn ngày trước ngày bắt đầu
                        />
                    </Form.Item>

                    <Form.Item label="Số tiền" name="amount">
                        <Input readOnly />
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

export default PaymentForAdsCourse;
