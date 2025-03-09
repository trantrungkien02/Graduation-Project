'use client';
import { useEffect, useState } from 'react';
import { Input, Select, Table, message } from 'antd';
import axios from 'axios';
import moment from 'moment'; // Sử dụng moment.js để định dạng thời gian

const PaymentList = () => {
    const [orderList, setOrderList] = useState([]); // Lưu danh sách thanh toán
    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('courseName');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrderList(); // Lấy danh sách thanh toán khi trang tải
    }, []);

    // Hàm gọi API để lấy danh sách thanh toán
    const fetchOrderList = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/v1/order/getallorder');
            setOrderList(response.data || []);
        } catch (error) {
            message.error('Không thể tải danh sách thanh toán.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý tìm kiếm với debounce
    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(async () => {
            if (searchText) {
                try {
                    const response = await axios.get('http://localhost:8000/v1/order/searchOrder', {
                        params: { field: searchField, q: searchText }, // Truyền đúng tham số 'field' và 'q'
                    });
                    setOrderList(response.data); // Cập nhật danh sách đơn hàng
                } catch (error) {
                    console.error('Error searching orders:', error);
                    message.error('Không thể tìm kiếm đơn hàng.');
                }
            } else {
                fetchOrderList(); // Nếu không có từ khóa tìm kiếm, tải lại danh sách đầy đủ
            }
        }, 300);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchText, searchField]); // Thêm searchField để đảm bảo useEffect chạy lại khi trường tìm kiếm thay đổi

    // Hàm định dạng số tiền
    const formatCurrency = (amount: any) => {
        if (!amount) return '0đ';
        return `${Number(amount / 100).toLocaleString('vi-VN')}đ`;
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: any, record: any, index: number) => index + 1,
            width: '5%',
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'courseName',
            key: 'courseName',
            width: '20%',
        },
        {
            title: 'Người gửi',
            dataIndex: 'senderUser',
            key: 'senderUser',
            width: '15%',
        },
        {
            title: 'Người nhận',
            dataIndex: 'receiveUser',
            key: 'receiveUser',
            width: '15%',
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: any) => formatCurrency(amount), // Hàm formatCurrency xử lý định dạng số tiền
            width: '15%',
        },
        {
            title: 'Loại thanh toán',
            dataIndex: 'type',
            key: 'type',
            render: (type: any) =>
                type === 'buy' ? 'Mua khóa học' : type === 'ads' ? 'Quảng cáo khóa học' : 'Không xác định',
            width: '15%',
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: any) => moment(createdAt).format('DD/MM/YYYY HH:mm:ss'),
            width: '20%',
        },
    ];

    return (
        <div className="payment-container pl-[40px] pr-[50px]">
            {/* Search Section */}
            <Input.Group compact style={{ marginBottom: '20px' }}>
                <Select defaultValue="courseName" onChange={setSearchField} style={{ width: '20%' }}>
                    <Select.Option value="courseName">Tên khóa học</Select.Option>
                    <Select.Option value="senderUser">Người gửi</Select.Option>
                    <Select.Option value="receiveUser">Người nhận</Select.Option>
                </Select>
                <Input.Search
                    placeholder="Tìm kiếm giao dịch"
                    onChange={(e) => setSearchText(e.target.value)}
                    enterButton
                    style={{ width: '80%' }}
                />
            </Input.Group>
            {/* Ant Design Table */}
            <Table
                columns={columns}
                dataSource={orderList}
                rowKey={(record) => record._id}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default PaymentList;
