'use client';
import React from 'react';
import Image from 'next/image';
import './tutorial.scss';
import { Pagination } from 'antd';
import { images } from '~/assets/images';

type Props = {};

const page = (props: Props) => {
    return (
        <div className="tutorial">
            <div className="inline-block">
                <h3 className="tutorial-title">Danh sách video hướng dẫn</h3>
            </div>
            <div className="flex flex-wrap tutorial-content gap-[30px] mt-8">
                <div className="item">
                    <button className=" transition duration-300 hover:scale-[1.05] border-none">
                        <Image
                            alt=""
                            src={images.workSpaceC}
                            className="ant-image-img object-contain cursor-pointer w-[280px] h-[185px]  "
                        />
                    </button>
                    <div className="py-3">
                        <p className="title-video">
                            <span>Hướng dẫn tạo Workspace</span>
                        </p>
                        <div className="flex justify-between items-center pt-2">
                            <h3 className="sub-title">TinaMYS</h3>
                        </div>
                    </div>
                    <button type="button" className="btn-tutorial">
                        Xem
                    </button>
                </div>
                <div className="item">
                    <button className=" transition duration-300 hover:scale-[1.05] border-none">
                        <Image
                            alt=""
                            src={images.groupC}
                            className="ant-image-img object-contain cursor-pointer w-[280px] h-[185px]  "
                        />
                    </button>
                    <div className="py-3">
                        <p className="title-video">
                            <span>Hướng dẫn tạo nhóm</span>
                        </p>
                        <div className="flex justify-between items-center pt-2">
                            <h3 className="sub-title">TinaMYS</h3>
                        </div>
                    </div>
                    <button type="button" className="btn-tutorial">
                        Xem
                    </button>
                </div>
                <div className="item">
                    <button className=" transition duration-300 hover:scale-[1.05] border-none">
                        <Image
                            alt=""
                            src={images.positionC}
                            className="ant-image-img object-contain cursor-pointer w-[280px] h-[185px]  "
                        />
                    </button>
                    <div className="py-3">
                        <p className="title-video">
                            <span>Hướng dẫn tạo chức vụ</span>
                        </p>
                        <div className="flex justify-between items-center pt-2">
                            <h3 className="sub-title">TinaMYS</h3>
                        </div>
                    </div>
                    <button type="button" className="btn-tutorial">
                        Xem
                    </button>
                </div>
            </div>
            <div className="absolute bottom-[5%] right-[5%]">
                <Pagination defaultCurrent={1} total={1} />
            </div>
        </div>
    );
};

export default page;
