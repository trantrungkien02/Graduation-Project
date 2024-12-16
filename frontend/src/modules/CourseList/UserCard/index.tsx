import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { images } from '~/assets/images';
import { getAllUsers } from '~/redux/stateglobal/apiRequest';
import { loginSuccess } from '~/redux/stateglobal/authSlice';

const UserCard = ({ user }: any) => {
    const currentUser = useSelector((state: any) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(currentUser, dispatch, loginSuccess);
    return (
        <div
            className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto course-item"
            onClick={() => router.push(`/teacher/${user?.slug}`)}
        >
            {/* Header Image */}
            <div
                className="h-40 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${user?.info?.headerImage || 'https://fullstack.edu.vn/assets/cover-profile-CDYcrPwJ.png'})`,
                    width: '322.8px',
                }}
            ></div>

            {/* Avatar */}
            <div className="flex justify-center -mt-20">
                <img
                    className="w-36 h-36 object-cover rounded-full border-4 border-white"
                    src={
                        user?.info?.avatar ||
                        'https://www.gravatar.com/avatar/7cf67a48f99e0b3621388d153627210a.jpg?s=80&d=mp&r=g'
                    }
                    alt={user.name}
                />
            </div>

            {/* User Info */}
            <div className="text-center px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">{user?.info?.fullName || user?.username}</h2>
                <p className="text-sm text-gray-600 mt-2">{user?.info?.bio || 'Chưa cập nhật'}</p>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-200 flex justify-between text-center text-sm px-6 py-3">
                <div>
                    <span className="block font-semibold text-gray-800">{user?.info?.followers}</span>
                    <span className="text-gray-600">Khóa học</span>
                </div>
                <div>
                    <span className="block font-semibold text-gray-800">{user?.info?.following}</span>
                    <span className="text-gray-600">Học viên</span>
                </div>
            </div>

            {/* Follow Button */}
            <button className="w-full bg-[#3d567f] text-white py-2 font-semibold hover:bg-[#213556]">Xem Ngay</button>
        </div>
    );
};

export default UserCard;
