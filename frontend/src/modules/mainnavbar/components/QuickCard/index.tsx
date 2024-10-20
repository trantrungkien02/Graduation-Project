'use client';
import { useState } from 'react';
import Image from 'next/image';
import { images } from '~/assets/images';
import './index.scss';
import { DatePicker, DatePickerProps, Form, Input, Modal, Radio, Select } from 'antd';

function QuickCard() {
    const [isModalQuickCardOpen, setIsModalQuickCardOpen] = useState(false);
    const [pickerType, setPickerType] = useState<'date' | 'time' | 'year' | 'week' | 'month' | 'quarter'>('year');

    const handleRadioChange = (e: any) => {
        const value = e.target.value;

        switch (value) {
            case 'monthCard':
                setPickerType('month');
                break;
            case 'preciousCard':
                setPickerType('quarter');
                break;
            case 'weekCard':
                setPickerType('week');
                break;
            default:
                setPickerType('year');
        }
    };
    const showModalQuickCard = () => {
        setIsModalQuickCardOpen(true);
    };

    const handleOkQuickCard = () => {
        setIsModalQuickCardOpen(false);
    };

    const handleCancelQuickCard = () => {
        setIsModalQuickCardOpen(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
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

    const onChangePicker: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };
    return (
        <div className=" hover:text-[#000]">
            <button
                onClick={showModalQuickCard}
                className="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#1c7fff] p-1 font-light ml-5 px-2.5"
            >
                Tạo nhanh
            </button>
            <Modal
                title="Tạo thẻ nhanh"
                width={410}
                centered
                footer={null}
                open={isModalQuickCardOpen}
                onOk={handleOkQuickCard}
                onCancel={handleCancelQuickCard}
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
                    <div className="form-item-custom w-full form-custom-quickcard">
                        <div className="title">
                            Tiêu đề thẻ mục tiêu<b className="text-red-600">*</b>
                        </div>
                        <Form.Item
                            name="namecard"
                            rules={[{ required: true, message: 'Tiêu đề thẻ mục tiêu không được để trống' }]}
                        >
                            <Input
                                name="namecard"
                                id="namecard"
                                className="input-formik-global !w-[362px]"
                                placeholder="Tiêu đề thẻ mục tiêu"
                            />
                        </Form.Item>
                    </div>
                    <div className="form-item-custom w-full form-custom-quickcard">
                        <div className="title">
                            Mục tiêu<b className="text-red-600">*</b>
                        </div>
                        <Form.Item name="radio-group-target">
                            <Radio.Group defaultValue="company">
                                <Radio value="company">Công ty</Radio>
                                <Radio value="person" className="ml-[80px]">
                                    Cá nhân
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className="form-item-custom w-full form-custom-quickcard">
                        <div className="title">
                            Level mục tiêu<b className="text-red-600">*</b>
                        </div>
                        <Form.Item name="radio-group-lever">
                            <Radio.Group defaultValue="leverCompany">
                                <Radio value="leverCompany">Công ty</Radio>
                                <Radio value="leverTeam" className="ml-[50px]">
                                    Nhóm
                                </Radio>
                                <Radio value="leverEmployee" className="ml-[50px]">
                                    Nhân sự
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className="form-item-custom form-custom-quickcard">
                        <div className="title">
                            Nhóm
                            <b className="text-red-600">*</b>
                        </div>
                        <Form.Item
                            name="quyMoNhanSu"
                            rules={[{ required: true, message: 'Nhóm không được để trống' }]}
                            className="border-none"
                        >
                            <Select
                                showSearch
                                placeholder="Công ty"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'company',
                                        label: 'Công ty',
                                    },
                                    {
                                        value: 'organization',
                                        label: 'Tổ chức',
                                    },
                                ]}
                                className="input-formik-global input-card"
                            />
                        </Form.Item>
                    </div>
                    <div className="form-item-custom w-full form-custom-quickcard">
                        <div className="title">
                            Vị trí của thẻ mục tiêu<b className="text-red-600">*</b>
                        </div>
                        <Form.Item name="radio-group-card">
                            <Radio.Group
                                defaultValue="yearCard"
                                onChange={handleRadioChange}
                                className=" flex flex-wrap gap-y-2.5 custom-radio-group items-center"
                            >
                                <Radio value="yearCard" className="w-[47%]">
                                    Thẻ năm
                                </Radio>
                                <Radio value="preciousCard" className="w-[47%]">
                                    Thẻ quý
                                </Radio>
                                <Radio value="monthCard" className="w-[47%]">
                                    Thẻ tháng
                                </Radio>
                                <Radio value="weekCard" className="w-[47%]">
                                    Thẻ tuần
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="year"
                        rules={[{ required: true, message: 'Vị trí của thẻ mục tiêu là bắt buộc!' }]}
                        className="mb-[20px]"
                    >
                        <DatePicker
                            onChange={onChangePicker}
                            picker={pickerType}
                            className="date-picker-formik-global"
                        />
                    </Form.Item>
                    <button
                        className="p-2 inline-flex items-center justify-center rounded-md transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#2082ff] font-semibold text-base h-11 w-full mb-1.2"
                        type="submit"
                    >
                        Thêm thẻ
                    </button>
                </Form>
            </Modal>
        </div>
    );
}
export default QuickCard;
