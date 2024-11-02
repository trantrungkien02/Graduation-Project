'use client';

import styled from 'styled-components';
import MainNavbar from '~/modules/mainnavbar';
import Sidebar from '~/modules/Sidebar';
import './layout.scss';

export default function Layouts({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="sticky top-0 z-[999]">
                <MainNavbar />
            </div>
            <div className="flex">
                <div className="h-full w-full content">{children}</div>
            </div>
        </div>
    );
}
