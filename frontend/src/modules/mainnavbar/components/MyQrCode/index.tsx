'use client';
import { useState } from 'react';
import Image from 'next/image';
import { images } from '~/assets/images';
import './index.scss';
import { Form, Input, Modal } from 'antd';

function MyQrCode() {
    const [isModalMyQrCodeOpen, setIsModalMyQrCodeOpen] = useState(false);

    const showModalMyQrCode = () => {
        setIsModalMyQrCodeOpen(true);
    };

    const handleOkMyQrCode = () => {
        setIsModalMyQrCodeOpen(false);
    };

    const handleCancelMyQrCode = () => {
        setIsModalMyQrCodeOpen(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="w-full hover:text-[#000]">
            <button
                type="button"
                className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] undefined"
                onClick={showModalMyQrCode}
            >
                Mã QR của tôi
            </button>
            <Modal
                title="Mã QR"
                width={500}
                centered
                footer={null}
                open={isModalMyQrCodeOpen}
                onOk={handleOkMyQrCode}
                onCancel={handleCancelMyQrCode}
                className="rounded-[10px]"
            >
                <div className="flex flex-col items-center w-full">
                    <div className="form-avatar pb-8">
                        <Image alt="" src={images.avtUser} className="rounded-[50%] w-[180px] h-[180px]" />
                    </div>
                    <div className="fullName pb-8">
                        <div className="flex justify-center text-3xl font-bold">B20DCPT106 Trần Trung Kiên</div>
                    </div>
                    <div className="qrcode pb-8">
                        <Image alt="" src={images.qrCode} />
                    </div>
                    <div className="grid grid-cols-2 w-full gap-x-6">
                        <button
                            onClick={handleCancelMyQrCode}
                            className="p-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-[#c7c7c7] h-9 px-3 text-black"
                        >
                            Đóng
                        </button>
                        <button className="p-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#1c7fff] h-9 px-3">
                            Lưu ảnh
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default MyQrCode;
