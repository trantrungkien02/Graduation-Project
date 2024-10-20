'use client';

import MainNavbar from '~/modules/mainnavbar';
import Sidebar from '~/modules/Sidebar';
import UserList from '~/modules/UserList';
import './page.scss';
import CourseList from '~/modules/CourseList';
export default function Home() {
    return (
        <div>
            <div>
                <MainNavbar />
            </div>
            <div className="flex">
                <Sidebar />
                <div className=" content">
                    <CourseList />
                </div>
            </div>
        </div>
    );
}
