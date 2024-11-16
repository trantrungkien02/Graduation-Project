'use client';

import styled from 'styled-components';
import MainNavbar from '~/modules/mainnavbar';
import Sidebar from '~/modules/Sidebar';
import './layout.scss';

export default function Layouts({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="sticky top-0 z-[999]"></div>
            <div className="flex">
                <div className=" w-full content-learn">{children}</div>
            </div>
        </div>
    );
}
