'use client';

import styled from 'styled-components';
import MainNavbar from '~/modules/mainnavbar';
import Sidebar from '~/modules/Sidebar';
import './layout.scss';
import Footer from '~/modules/Footer';

export default function Layouts({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full overflow-auto">
            <div className="sticky top-0 z-[999]">
                <MainNavbar />
            </div>
            <div className="flex">
                <Sidebar />
                <div className="h-full w-full content">{children}</div>
            </div>
            <Footer />
        </div>
    );
}
