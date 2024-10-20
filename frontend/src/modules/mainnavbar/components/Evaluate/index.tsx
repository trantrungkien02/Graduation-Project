'use client';
import { useState } from 'react';
import Image from 'next/image';
import { images } from '~/assets/images';
import './index.scss';
import { Modal } from 'antd';

function Evaluate() {
    const [isModalEvaluateOpen, setIsModalEvaluateOpen] = useState(false);

    const showModalEvaluate = () => {
        setIsModalEvaluateOpen(true);
    };

    const handleOkEvaluate = () => {
        setIsModalEvaluateOpen(false);
    };

    const handleCancelEvaluate = () => {
        setIsModalEvaluateOpen(false);
    };
    return (
        <div className="w-full hover:text-[#000]">
            <button
                type="button"
                className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] undefined"
                onClick={showModalEvaluate}
            >
                Đánh giá
            </button>
            <Modal
                title="Đánh giá"
                width={620}
                centered
                footer={null}
                open={isModalEvaluateOpen}
                onOk={handleOkEvaluate}
                onCancel={handleCancelEvaluate}
                className="ant-modal-custom"
            >
                <div className="flex flex-col items-center w-full">
                    <div className="mb-3">Bạn có hài lòng với KTGroup không?</div>
                    <div className="flex">
                        <button type="button" className="mx-2">
                            <svg
                                width="34"
                                height="31"
                                viewBox="0 0 34 31"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    opacity="0.8"
                                    d="M15.1862 2.40717C15.9806 1.24803 17.6913 1.24803 18.4857 2.40717L22.4293 8.16138C22.6893 8.54084 23.0723 8.81905 23.5135 8.94912L30.2047 10.9216C31.5526 11.3189 32.0813 12.9458 31.2243 14.0596L26.9704 19.5883C26.6899 19.9529 26.5436 20.4031 26.5563 20.8629L26.748 27.8361C26.7867 29.2409 25.4027 30.2464 24.0787 29.7755L17.506 27.4383C17.0726 27.2842 16.5993 27.2842 16.1658 27.4383L9.59315 29.7755C8.26913 30.2464 6.88518 29.2409 6.92381 27.8362L7.1156 20.8629C7.12825 20.4031 6.98198 19.9529 6.70146 19.5883L2.44753 14.0596C1.5906 12.9458 2.11923 11.3189 3.46712 10.9216L10.1583 8.94912C10.5996 8.81905 10.9825 8.54084 11.2426 8.16138L15.1862 2.40717Z"
                                    fill="#FFB802"
                                ></path>
                            </svg>
                        </button>
                        <button type="button" className="mx-2">
                            <svg
                                width="34"
                                height="31"
                                viewBox="0 0 34 31"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    opacity="0.8"
                                    d="M15.1862 2.40717C15.9806 1.24803 17.6913 1.24803 18.4857 2.40717L22.4293 8.16138C22.6893 8.54084 23.0723 8.81905 23.5135 8.94912L30.2047 10.9216C31.5526 11.3189 32.0813 12.9458 31.2243 14.0596L26.9704 19.5883C26.6899 19.9529 26.5436 20.4031 26.5563 20.8629L26.748 27.8361C26.7867 29.2409 25.4027 30.2464 24.0787 29.7755L17.506 27.4383C17.0726 27.2842 16.5993 27.2842 16.1658 27.4383L9.59315 29.7755C8.26913 30.2464 6.88518 29.2409 6.92381 27.8362L7.1156 20.8629C7.12825 20.4031 6.98198 19.9529 6.70146 19.5883L2.44753 14.0596C1.5906 12.9458 2.11923 11.3189 3.46712 10.9216L10.1583 8.94912C10.5996 8.81905 10.9825 8.54084 11.2426 8.16138L15.1862 2.40717Z"
                                    fill="#FFB802"
                                ></path>
                            </svg>
                        </button>
                        <button type="button" className="mx-2">
                            <svg
                                width="34"
                                height="31"
                                viewBox="0 0 34 31"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    opacity="0.8"
                                    d="M15.1862 2.40717C15.9806 1.24803 17.6913 1.24803 18.4857 2.40717L22.4293 8.16138C22.6893 8.54084 23.0723 8.81905 23.5135 8.94912L30.2047 10.9216C31.5526 11.3189 32.0813 12.9458 31.2243 14.0596L26.9704 19.5883C26.6899 19.9529 26.5436 20.4031 26.5563 20.8629L26.748 27.8361C26.7867 29.2409 25.4027 30.2464 24.0787 29.7755L17.506 27.4383C17.0726 27.2842 16.5993 27.2842 16.1658 27.4383L9.59315 29.7755C8.26913 30.2464 6.88518 29.2409 6.92381 27.8362L7.1156 20.8629C7.12825 20.4031 6.98198 19.9529 6.70146 19.5883L2.44753 14.0596C1.5906 12.9458 2.11923 11.3189 3.46712 10.9216L10.1583 8.94912C10.5996 8.81905 10.9825 8.54084 11.2426 8.16138L15.1862 2.40717Z"
                                    fill="#FFB802"
                                ></path>
                            </svg>
                        </button>
                        <button type="button" className="mx-2">
                            <svg
                                width="34"
                                height="31"
                                viewBox="0 0 34 31"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    opacity="0.8"
                                    d="M15.1862 2.40717C15.9806 1.24803 17.6913 1.24803 18.4857 2.40717L22.4293 8.16138C22.6893 8.54084 23.0723 8.81905 23.5135 8.94912L30.2047 10.9216C31.5526 11.3189 32.0813 12.9458 31.2243 14.0596L26.9704 19.5883C26.6899 19.9529 26.5436 20.4031 26.5563 20.8629L26.748 27.8361C26.7867 29.2409 25.4027 30.2464 24.0787 29.7755L17.506 27.4383C17.0726 27.2842 16.5993 27.2842 16.1658 27.4383L9.59315 29.7755C8.26913 30.2464 6.88518 29.2409 6.92381 27.8362L7.1156 20.8629C7.12825 20.4031 6.98198 19.9529 6.70146 19.5883L2.44753 14.0596C1.5906 12.9458 2.11923 11.3189 3.46712 10.9216L10.1583 8.94912C10.5996 8.81905 10.9825 8.54084 11.2426 8.16138L15.1862 2.40717Z"
                                    fill="#FFB802"
                                ></path>
                            </svg>
                        </button>
                        <button type="button" className="mx-2">
                            <svg
                                width="34"
                                height="31"
                                viewBox="0 0 34 31"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    opacity="0.8"
                                    d="M15.1862 2.40717C15.9806 1.24803 17.6913 1.24803 18.4857 2.40717L22.4293 8.16138C22.6893 8.54084 23.0723 8.81905 23.5135 8.94912L30.2047 10.9216C31.5526 11.3189 32.0813 12.9458 31.2243 14.0596L26.9704 19.5883C26.6899 19.9529 26.5436 20.4031 26.5563 20.8629L26.748 27.8361C26.7867 29.2409 25.4027 30.2464 24.0787 29.7755L17.506 27.4383C17.0726 27.2842 16.5993 27.2842 16.1658 27.4383L9.59315 29.7755C8.26913 30.2464 6.88518 29.2409 6.92381 27.8362L7.1156 20.8629C7.12825 20.4031 6.98198 19.9529 6.70146 19.5883L2.44753 14.0596C1.5906 12.9458 2.11923 11.3189 3.46712 10.9216L10.1583 8.94912C10.5996 8.81905 10.9825 8.54084 11.2426 8.16138L15.1862 2.40717Z"
                                    fill="#FFB802"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div className="self-start mt-5">
                        <button type="button" className="text-white bg-gray-300 mx-1.5 px-3 py-1.5 rounded-full">
                            Tốt
                        </button>
                        <button type="button" className="text-white bg-gray-300 mx-1.5 px-3 py-1.5 rounded-full">
                            Rất hài lòng
                        </button>
                        <button type="button" className="text-white bg-gray-300 mx-1.5 px-3 py-1.5 rounded-full">
                            Sử dụng tốt
                        </button>
                        <button type="button" className="text-white bg-gray-300 mx-1.5 px-3 py-1.5 rounded-full">
                            Hiệu quả
                        </button>
                        <button type="button" className="text-white bg-gray-300 mx-1.5 px-3 py-1.5 rounded-full">
                            Giá thành hợp lý
                        </button>
                    </div>
                    <div className="self-start mt-7 w-full ">
                        <div className="text-base font-medium mb-1"> Đánh giá</div>
                        <textarea className="ant-input ant-text-area-global undefined"></textarea>
                    </div>
                    <div className="flex justify-between w-full mt-9">
                        <button
                            onClick={handleCancelEvaluate}
                            className="p-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed h-9 px-3 text-black bg-gray-300 w-[280px]"
                        >
                            Hủy
                        </button>
                        <button className="p-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#1c7fff] h-9 px-3 w-[280px]">
                            Đánh giá
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default Evaluate;
