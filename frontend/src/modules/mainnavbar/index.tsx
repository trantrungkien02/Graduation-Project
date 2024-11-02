import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { images } from '~/assets/images';
import {
    SearchOutlined,
    CheckCircleOutlined,
    SmileOutlined,
    InsertRowAboveOutlined,
    DownOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { MenuProps, RadioChangeEvent } from 'antd';
import { Button, Input, Dropdown, Space, Tabs, Empty, Menu, Radio } from 'antd';
import './index.scss';
import { icons } from '~/assets/images/icons/icons';
import Evaluate from './components/Evaluate';
import ChangePassword from './components/ChangePassword';
import MyQrCode from './components/MyQrCode';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { logOutSuccess } from '~/redux/stateglobal/authSlice';
import { logOut } from '~/redux/stateglobal/apiRequest';

function MainNavbar() {
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const user = useSelector((state: any) => state.auth.login.currentUser);
    console.log(user);
    const router = useRouter();
    const accessToken = user?.accessToken;
    const id = user?._id;
    console.log(id, accessToken);
    let axiosJWT = createAxios(user, dispatch, logOutSuccess);

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handleBlur = () => {
        setIsExpanded(false);
    };

    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const handleLogout = () => {
        logOut(dispatch, id, router, accessToken, axiosJWT);
        console.log(id, accessToken);
        console.log(user);
    };

    const itemsNotification = (
        <div className="dropdown-notification">
            <div className="flex p-3 items-center justify-between border-solid border-b border-slate-200">
                <p className="font-normal text-base">Thông báo</p>
                <button type="button">
                    <div className="font-normal text-sm text-blue-500 items-center flex">
                        Đánh dấu tất cả là đã đọc
                        <CheckCircleOutlined className="ml-1" />
                    </div>
                </button>
            </div>
            <Tabs defaultActiveKey="1" centered>
                <Tabs.TabPane tab="Tất cả" key="1">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Cá nhân" key="2">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Nhóm" key="3">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Công ty" key="4">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Hệ thống" key="5">
                    <div className="list-noti custom-scrollbar">
                        <Empty
                            description="Không có dữ liệu"
                            image={images.noData.default.src}
                            className=" p-5 flex flex-col justify-center items-center"
                        />
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );

    const itemsContacts = (
        <div className="dropdown-contact w-[442px] mt-1">
            <p className="font-normal text-base text-center p-2.5 border-b border-[#DCDCDC]">Liên hệ trợ giúp</p>
            <div className="px-4 my-5">
                <Link
                    href="tel:+(84) 246 329 5589"
                    className=" flex justify-start items-center bg-[#f2faff] gap-x-2 p-5 mb-2.5"
                >
                    <Image src={icons.iconUser} alt=""></Image>
                    <div>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.85)',
                            }}
                        >
                            Số điện thoại hỗ trợ
                        </p>
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            +(84) 246 329 5589
                        </p>
                    </div>
                </Link>
                <Link
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@tinasoft.vn"
                    className=" flex justify-start items-center bg-[#f2faff] gap-x-2 p-5 mb-2.5"
                >
                    <Image src={icons.iconTele} alt=""></Image>
                    <div>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.85)',
                            }}
                        >
                            Email
                        </p>
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            contact@tinasoft.vn
                        </p>
                    </div>
                </Link>
                <Link
                    href="tel:+(84) 246 329 5589"
                    className=" flex justify-start items-center bg-[#f2faff] gap-x-2 p-5 mb-2.5"
                >
                    <Image src={icons.iconBriefcase} alt=""></Image>
                    <div>
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.85)',
                            }}
                        >
                            Địa chỉ hỗ trợ
                        </p>
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: 'normal',
                                color: 'rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            Tầng 4, Tòa nhà Ellipse Tower, 110 Trần Phú, Hà Đông, Hà Nội
                        </p>
                    </div>
                </Link>
            </div>
            <div className="px-4 pb-5">
                <div className="relative">
                    <div className="width: 400px; height: 220px; position: relative; overflow: hidden;"></div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.3797312709403!2d105.78145401112488!3d20.9774101805784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accd83d48047%3A0x66b216d46fa4648d!2zQ8O0bmcgdHkgQ-G7lSBQaOG6p24gVGluYXNvZnQgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1721058600870!5m2!1svi!2s"
                        width="408"
                        height="220"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );

    const itemsLanguage = (
        <div className="dropdown-setting absolute top-[19.5rem]">
            <div className="flex flex-col justify-center">
                <div className="border-b border-[#DCDCDC] px-5 pb-2.5">
                    <p className="text-xs font-medium my-3"> Ngôn ngữ</p>
                    <Radio.Group onChange={onChange} value={value}>
                        <Space direction="vertical">
                            <Radio value={1} className=" text-base font-light text-gray-900 flex py-2 gap-3">
                                Tiếng Việt
                            </Radio>
                            <Radio value={2} className=" text-base font-light text-gray-900 flex py-2 gap-3">
                                English
                            </Radio>
                            <Radio value={3} className=" text-base font-light text-gray-900 flex py-2 gap-3">
                                中國人
                            </Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <div className="border-b border-[#DCDCDC] px-5 pb-5">
                    <p className="text-xs font-medium my-3">Chủ đề</p>
                    <Radio.Group defaultValue={4} style={{ width: '100%' }}>
                        <Radio value={4} className=" text-base font-light text-gray-900 flex items-center py-2 gap-3">
                            <div className="flex items-center">
                                <InsertRowAboveOutlined
                                    style={{
                                        fontSize: '34px',
                                        backgroundColor: 'white',
                                        color: 'rgb(230, 230, 230)',
                                        marginRight: '20px',
                                    }}
                                />
                                <p>Sáng</p>
                            </div>
                        </Radio>
                    </Radio.Group>
                </div>
            </div>
        </div>
    );
    const itemsUser = (
        <div className="dropdown-user w-[320px]">
            <div className="flex justify-center items-center py-5 px-4 border-b border-[#DCDCDC] relative">
                <Image
                    alt=""
                    src={images.avtUser}
                    className="ant-image-img mt-1 absolute top-4 left-3"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '100%' }}
                />
                <div className="flex flex-col justify-center items-start ml-12 h-[48px]">
                    <span className="font-normal text-lg leading-5">{user?.username}</span>
                    <span className="font-light text-sm leading-5">{user?.email}</span>
                </div>
            </div>
            <div className="flex flex-col justify-center items-start text-[#555]">
                <Link href="/" className="w-full hover:text-[#000]">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] hover:text-[#000] undefined"
                    >
                        Giới thiệu
                    </button>
                </Link>

                <Link href="/profile-account" className="w-full hover:text-[#000]">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] hover:text-[#000] undefined"
                    >
                        Thông tin tài khoản
                    </button>
                </Link>
                <Evaluate />
                <Link href="/terms-of-use" className="w-full hover:text-[#000]">
                    <button
                        type="button"
                        className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] border-b border-[#DCDCDC]"
                    >
                        Chính sách về quyền riêng tư
                    </button>
                </Link>
                <Dropdown
                    overlay={itemsLanguage}
                    trigger={['click']}
                    placement="bottom"
                    className="w-full hover:text-[#000]"
                >
                    <button
                        type="button"
                        className=" w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6]  undefined"
                    >
                        <div className="ant-dropdown-trigger text-start w-full cursor-pointer">Language</div>
                    </button>
                </Dropdown>
                <ChangePassword />
                <MyQrCode />
                <button
                    type="button"
                    className="w-full flex justify-between items-center font-normal leading-normal
                text-base py-[9px] px-4 hover:bg-[#F6F6F6] hover:text-[#000] border-b border-[#DCDCDC] border-t "
                >
                    Danh sách liên hệ của tôi
                </button>
            </div>
            <div className="py-2 text-[#555] hover:text-[#000]">
                <button
                    type="button"
                    className="w-full flex justify-between items-center font-normal leading-normal text-base px-4 py-[9px] hover:bg-[#F6F6F6]"
                    onClick={handleLogout}
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );

    return (
        <div className="navbar flex items-center bg-white">
            <div className="flex items-center navbar-left">
                <Link href="/">
                    <Image alt="" src={images.logo} />
                </Link>
            </div>
            <div
                className={`cursor-pointer expanding-search-global transition-all 'w-[500px]'`}
                onClick={handleFocus}
                onBlur={handleBlur}
                tabIndex={0}
            >
                <Input
                    size="large"
                    placeholder="Tìm kiếm khóa học"
                    prefix={<SearchOutlined className="opacity-[.7] mr-1" />}
                    className={` rounded-[20px] bg-white h-[40px] ml-[6px] w-[500px]`}
                />
            </div>
            <div className="flex items-center justify-center navbar-right gap-x-3">
                <Link href="/tutorial">
                    <Button className="p-0 border-none mt-[7px]">
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24.00 24.00"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#000000"
                            stroke-width="1"
                        >
                            <path
                                d="M3.84299 8.12534L11.1877 4.86101C11.7049 4.63118 12.2951 4.63118 12.8123 4.86101L20.157 8.12534C20.4817 8.26962 20.4817 8.73038 20.157 8.87466L12.8123 12.139C12.2951 12.3688 11.7049 12.3688 11.1877 12.139L3.84299 8.87466C3.51835 8.73038 3.51835 8.26962 3.84299 8.12534Z"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke="#242424"
                                stroke-width="1"
                            ></path>
                            <path
                                d="M20.5 8.5V12.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke="#242424"
                                stroke-width="1"
                            ></path>
                            <path
                                d="M6.5 10.5V15.5C6.5 15.5 7 17.5 12 17.5C17 17.5 17.5 15.5 17.5 15.5V10.5"
                                stroke="#242424"
                                stroke-width="1"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                        </svg>
                    </Button>
                </Link>

                <Dropdown overlay={itemsNotification} trigger={['click']}>
                    <Link href="">
                        <Space>
                            <svg
                                height="22"
                                viewBox="0 0 48 48"
                                width="22"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mt-[5px]"
                            >
                                <defs>
                                    <path
                                        d="M 18 40 L 30 40 L 30 45.550781 L 18 45.550781 Z M 18 40 "
                                        clip-rule="nonzero"
                                    ></path>
                                    <path
                                        d="M 3.179688 0 L 45.058594 0 L 45.058594 40 L 3.179688 40 Z M 3.179688 0 "
                                        clip-rule="nonzero"
                                    ></path>
                                </defs>
                                <path
                                    fill="#242424"
                                    d="M 24.117188 43.492188 C 22.453125 43.492188 20.953125 42.519531 20.28125 41.011719 L 18.371094 41.839844 C 19.371094 44.089844 21.625 45.550781 24.117188 45.550781 C 26.648438 45.550781 28.910156 44.070312 29.894531 41.777344 L 27.972656 40.96875 C 27.308594 42.5 25.800781 43.492188 24.117188 43.492188 Z M 24.117188 43.492188 "
                                    fill-opacity="1"
                                    fill-rule="nonzero"
                                    stroke="#242424"
                                    stroke-width="1"
                                ></path>
                                <path
                                    fill="#242424"
                                    d="M 44.644531 36.511719 L 39.128906 31.972656 C 38.890625 31.773438 38.75 31.492188 38.75 31.183594 L 38.75 18.730469 C 38.75 14.746094 37.140625 11.035156 34.214844 8.285156 C 32.496094 6.671875 30.453125 5.527344 28.246094 4.890625 C 28.292969 4.574219 28.3125 4.257812 28.285156 3.921875 C 28.128906 2.160156 26.8125 0.664062 25.082031 0.28125 C 23.816406 0 22.507812 0.289062 21.507812 1.078125 C 20.511719 1.871094 19.941406 3.039062 19.941406 4.300781 C 19.941406 4.511719 19.980469 4.703125 20.007812 4.902344 C 13.898438 6.699219 9.484375 12.378906 9.484375 19.113281 L 9.484375 31.175781 C 9.484375 31.484375 9.347656 31.773438 9.109375 31.964844 L 3.589844 36.503906 C 3.351562 36.703125 3.210938 36.992188 3.210938 37.292969 L 3.210938 38.328125 C 3.210938 38.898438 3.683594 39.363281 4.261719 39.363281 L 43.976562 39.363281 C 44.554688 39.363281 45.023438 38.898438 45.023438 38.328125 L 45.023438 37.292969 C 45.015625 36.992188 44.875 36.703125 44.644531 36.511719 Z M 22.019531 4.300781 C 22.019531 3.667969 22.304688 3.085938 22.804688 2.6875 C 23.308594 2.285156 23.941406 2.140625 24.613281 2.285156 C 25.453125 2.476562 26.113281 3.230469 26.195312 4.09375 C 26.207031 4.210938 26.1875 4.328125 26.179688 4.445312 C 25.269531 4.320312 24.347656 4.273438 23.402344 4.3125 C 22.941406 4.328125 22.480469 4.375 22.03125 4.445312 C 22.039062 4.394531 22.019531 4.347656 22.019531 4.300781 Z M 5.890625 37.300781 L 10.441406 33.554688 C 11.160156 32.964844 11.574219 32.101562 11.574219 31.175781 L 11.574219 19.113281 C 11.574219 12.28125 16.816406 6.679688 23.511719 6.371094 C 26.988281 6.207031 30.269531 7.425781 32.773438 9.773438 C 35.273438 12.132812 36.652344 15.3125 36.652344 18.730469 L 36.652344 31.175781 C 36.652344 32.089844 37.066406 32.964844 37.785156 33.554688 L 42.339844 37.300781 Z M 5.890625 37.300781 "
                                    fill-opacity="1"
                                    fill-rule="nonzero"
                                    stroke="#242424"
                                    stroke-width="1"
                                ></path>
                            </svg>
                        </Space>
                    </Link>
                </Dropdown>
                <Dropdown overlay={itemsContacts} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                                className="mt-[5px]"
                            >
                                <path
                                    d="M15.3125 19.6875C15.3125 19.9471 15.2355 20.2008 15.0913 20.4167C14.9471 20.6325 14.7421 20.8008 14.5023 20.9001C14.2624 20.9994 13.9985 21.0254 13.7439 20.9748C13.4893 20.9241 13.2555 20.7991 13.0719 20.6156C12.8884 20.432 12.7634 20.1982 12.7127 19.9436C12.6621 19.689 12.6881 19.4251 12.7874 19.1852C12.8868 18.9454 13.055 18.7404 13.2708 18.5962C13.4867 18.452 13.7404 18.375 14 18.375C14.3481 18.375 14.6819 18.5133 14.9281 18.7594C15.1742 19.0056 15.3125 19.3394 15.3125 19.6875ZM14 7.875C11.5872 7.875 9.625 9.64141 9.625 11.8125V12.25C9.625 12.4821 9.71719 12.7046 9.88129 12.8687C10.0454 13.0328 10.2679 13.125 10.5 13.125C10.7321 13.125 10.9546 13.0328 11.1187 12.8687C11.2828 12.7046 11.375 12.4821 11.375 12.25V11.8125C11.375 10.6094 12.553 9.625 14 9.625C15.447 9.625 16.625 10.6094 16.625 11.8125C16.625 13.0156 15.447 14 14 14C13.7679 14 13.5454 14.0922 13.3813 14.2563C13.2172 14.4204 13.125 14.6429 13.125 14.875V15.75C13.125 15.9821 13.2172 16.2046 13.3813 16.3687C13.5454 16.5328 13.7679 16.625 14 16.625C14.2321 16.625 14.4546 16.5328 14.6187 16.3687C14.7828 16.2046 14.875 15.9821 14.875 15.75V15.6712C16.87 15.3048 18.375 13.7134 18.375 11.8125C18.375 9.64141 16.4128 7.875 14 7.875ZM25.375 14C25.375 16.2498 24.7079 18.449 23.458 20.3196C22.2081 22.1902 20.4315 23.6482 18.353 24.5091C16.2745 25.3701 13.9874 25.5953 11.7809 25.1564C9.57432 24.7175 7.54749 23.6342 5.95667 22.0433C4.36584 20.4525 3.28248 18.4257 2.84357 16.2192C2.40467 14.0126 2.62993 11.7255 3.49088 9.64698C4.35182 7.56847 5.80978 5.79193 7.68039 4.54203C9.551 3.29213 11.7502 2.625 14 2.625C17.0159 2.62818 19.9073 3.82764 22.0398 5.96018C24.1724 8.09271 25.3718 10.9841 25.375 14ZM23.625 14C23.625 12.0964 23.0605 10.2355 22.0029 8.65264C20.9453 7.06981 19.4421 5.83615 17.6833 5.10766C15.9246 4.37917 13.9893 4.18856 12.1223 4.55994C10.2552 4.93132 8.54018 5.84802 7.1941 7.1941C5.84802 8.54018 4.93133 10.2552 4.55995 12.1223C4.18856 13.9893 4.37917 15.9246 5.10766 17.6833C5.83616 19.4421 7.06982 20.9453 8.65264 22.0029C10.2355 23.0605 12.0964 23.625 14 23.625C16.5518 23.6221 18.9983 22.6071 20.8027 20.8027C22.6071 18.9983 23.6221 16.5518 23.625 14Z"
                                    fill="#242424"
                                    stroke="#242424"
                                    stroke-width="0"
                                ></path>
                            </svg>
                        </Space>
                    </a>
                </Dropdown>
                <Dropdown overlay={itemsUser} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Image
                                alt=""
                                src={images.avtUser}
                                className="ant-image-img mt-1"
                                style={{ height: '31px', objectFit: 'cover', borderRadius: '100%' }}
                            />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        </div>
    );
}

export default MainNavbar;
