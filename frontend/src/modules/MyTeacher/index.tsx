interface UserProps {
    params: { slug: string };
}
export default function Myteacher({ params }: UserProps) {
    console.log(params.slug);
    const courses = [
        {
            id: 1,
            title: 'Kiến Thức Nhập Môn IT',
            description:
                'Để có cái nhìn tổng quan về ngành IT - Lập trình web các bạn nên xem các videos tại khóa này trước nhé.',
            bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
        },
        {
            id: 2,
            title: 'Lập trình C++ cơ bản, nâng cao',
            description:
                'Khóa học lập trình C++ từ cơ bản tới nâng cao dành cho người mới bắt đầu. Mục tiêu của khóa học này nhằm giúp các bạn nắm được các khái niệm căn c...',
            bgColor: 'bg-gradient-to-r from-teal-400 to-blue-500',
        },
    ];
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-300 via-pink-300 to-orange-300 h-64 flex justify-center items-center">
                <h1 className="text-2xl font-mono text-white">document.write('Hello, World');</h1>
            </div>

            {/* Profile Section */}
            <div className="container mx-auto mt-[-5rem]">
                <div className="bg-white rounded-lg shadow-lg p-6 relative z-10">
                    {/* Avatar */}
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white -mt-16"></div>
                    </div>
                    {/* User Info */}
                    <div className="text-center mt-4">
                        <h2 className="text-xl font-bold">B20DCPT106 Trần Trung Kiên</h2>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="col-span-1 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="font-bold mb-4">Giới thiệu</h3>
                    <p className="text-gray-600">🧑‍💻 Thành viên của F8 - Học lập trình để đi làm từ 5 tháng trước</p>

                    <h3 className="font-bold mt-6">Hoạt động gần đây</h3>
                    <p className="text-gray-600">Chưa có hoạt động gần đây</p>
                </div>

                {/* Right Section */}
                <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="font-bold mb-4">Các khóa học đã tham gia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <div key={course.id} className={`p-4 rounded-lg shadow-md ${course.bgColor}`}>
                                <h4 className="text-white font-bold">{course.title}</h4>
                                <p className="text-white mt-2 text-sm">{course.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
