'use client';
import { Menu } from 'antd';
import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import './index.scss';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faRoad, faBook, faPlus, faUserGroup, faGear, faSpinner } from '@fortawesome/free-solid-svg-icons';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode): MenuItem {
    return {
        key,
        icon,
        label,
    } as MenuItem;
}

function Sidebar() {
    const [selectedKey, setSelectedKey] = useState<string>('1');
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const items: MenuProps['items'] = [
        getItem(
            <Link href="/" className="flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faHome} className="mb-[8px] text-[18px] text-[#000]" />
                <p className="!text-[#000] text-xs">Trang chủ</p>
            </Link>,
            '1',
        ),
        getItem(
            <Link
                href="/"
                className="flex flex-col items-center justify-center"
                onClick={() => console.log(user?.role)}
            >
                <FontAwesomeIcon icon={faRoad} className="mb-[8px] text-[18px] text-[#000]" />
                <p className="!text-[#000] text-xs">Lộ trình</p>
            </Link>,
            '2',
        ),
        getItem(
            <Link href="/" className="flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faBook} className="mb-[8px] text-[18px] text-[#000]" />
                <p className="!text-[#000] text-xs">Bài viết</p>
            </Link>,
            '3',
        ),
    ];

    if (user?.role === '2') {
        items.push(
            getItem(
                <Link href="/manage-course" className="flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faPlus} className="mb-[8px] text-[18px] text-[#000]" />
                    <p className="!text-[#000] text-xs">Ql khóa học</p>
                </Link>,
                '4',
            ),
            getItem(
                <Link href="/manage-lesson" className="flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faGear} className="mb-[8px] text-[18px] text-[#000]" />
                    <p className="!text-[#000] text-xs">Bài giảng</p>
                </Link>,
                '5',
            ),
        );
    }

    if (user?.role === '3') {
        items.push(
            getItem(
                <Link href="/user-list" className="flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faUserGroup} className="mb-[8px] text-[18px] text-[#000]" />
                    <p className="!text-[#000] text-xs">Người dùng</p>
                </Link>,
                '6',
            ),
            getItem(
                <Link href="/system" className="flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faGear} className="mb-[8px] text-[18px] text-[#000]" />
                    <p className="!text-[#000] text-xs">Hệ thống</p>
                </Link>,
                '7',
            ),
        );
    }
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setIsLoading(true);
        setSelectedKey(e.key);
        setIsLoading(false);
    };

    return (
        <div className={`sidebar sidebar-custom relative`}>
            <div className="sidebar-detail__wrap">
                <div className="sidebar-detail">
                    {isLoading ? (
                        <FontAwesomeIcon
                            icon={faSpinner}
                            className="text-[30px] mt-[5px] text-[#555] hover:text-[#0b3a82] motion-preset-spin "
                        />
                    ) : (
                        <Menu
                            onClick={handleMenuClick}
                            style={{ width: 96 }}
                            selectedKeys={[selectedKey]}
                            mode="inline"
                            items={items}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
