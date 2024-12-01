import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useState, useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Charts({ data }: any) {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [registrationStartDate, setRegistrationStartDate] = useState<string>('');
    const [registrationEndDate, setRegistrationEndDate] = useState<string>('');
    const [timeRange, setTimeRange] = useState<string>('');
    const [searchRegistration, setSearchRegistration] = useState<string>(''); // Tìm kiếm số lượt đăng ký
    const [searchRevenue, setSearchRevenue] = useState<string>(''); // Tìm kiếm doanh thu
    const [searchInstructor, setSearchInstructor] = useState<string>(''); // Tìm kiếm doanh thu theo giảng viên
    const [sortOrder, setSortOrder] = useState<string>(''); // 'asc' là từ nhỏ đến lớn, 'desc' là từ lớn đến nhỏ hoặc để trống để không sắp xếp
    const [sortInstructorOrder, setSortInstructorOrder] = useState<string>('');

    const getTimeRangeDates = () => {
        const today = new Date();
        let start: Date | null = null;
        let end: Date | null = null;

        if (timeRange === 'week') {
            const firstDay = today.getDate() - today.getDay();
            start = new Date(today.setDate(firstDay));
            end = new Date(today.setDate(firstDay + 6));
        } else if (timeRange === 'month') {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else if (timeRange === 'year') {
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
        }

        return { start, end };
    };

    useEffect(() => {
        const { start, end } = getTimeRangeDates();
        if (start && end) {
            setRegistrationStartDate(start.toISOString().split('T')[0]);
            setRegistrationEndDate(end.toISOString().split('T')[0]);
        }
    }, [timeRange]);

    // Hàm tính doanh thu
    const calculateRevenue = () => {
        return data.map((course: any) => {
            if (!startDate && !endDate) {
                return course.price === 'Miễn phí' ? 0 : parseInt(course.price) * course.registrations;
            }

            const filteredUsers = course.registeredUsers.filter((user: any) => {
                const registeredAt = new Date(user.registeredAt);
                return (
                    (!startDate || new Date(startDate) <= registeredAt) &&
                    (!endDate || registeredAt <= new Date(endDate))
                );
            });

            return course.price === 'Miễn phí' ? 0 : parseInt(course.price) * filteredUsers.length;
        });
    };

    // Hàm sắp xếp dữ liệu theo thứ tự đã chọn cho biểu đồ số lượt đăng ký
    const sortRegistrationData = (data: any[]) => {
        if (!sortOrder) return data; // Không sắp xếp khi không có chọn sắp xếp
        return [...data].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.registrations - b.registrations;
            }
            return b.registrations - a.registrations;
        });
    };

    // Hàm sắp xếp dữ liệu theo doanh thu
    const sortRevenueData = (data: any[]) => {
        if (!sortOrder) return data; // Không sắp xếp khi không có chọn sắp xếp
        return [...data].sort((a, b) => {
            const revenueA = a.price === 'Miễn phí' ? 0 : parseInt(a.price) * a.registrations;
            const revenueB = b.price === 'Miễn phí' ? 0 : parseInt(b.price) * b.registrations;
            if (sortOrder === 'asc') {
                return revenueA - revenueB;
            }
            return revenueB - revenueA;
        });
    };

    const calculateRegistrations = (course: any) => {
        if (!registrationStartDate && !registrationEndDate) {
            // Nếu không chọn khoảng thời gian, trả về số lượt đăng ký tổng
            return course.registrations;
        }

        // Lọc người dùng trong khoảng thời gian
        const filteredUsers = course.registeredUsers.filter((user: any) => {
            const registeredAt = new Date(user.registeredAt);
            return (
                (!registrationStartDate || new Date(registrationStartDate) <= registeredAt) &&
                (!registrationEndDate || registeredAt <= new Date(registrationEndDate))
            );
        });

        return filteredUsers.length; // Số lượng người dùng đã đăng ký trong khoảng thời gian
    };

    // Hàm sắp xếp dữ liệu theo số lượt đăng ký
    const sortRegistrationDataTime = (data: any[]) => {
        if (!sortOrder) return data;
        return [...data].sort((a, b) => {
            const aRegistrations = calculateRegistrations(a);
            const bRegistrations = calculateRegistrations(b);
            if (sortOrder === 'asc') {
                return aRegistrations - bRegistrations;
            }
            return bRegistrations - aRegistrations;
        });
    };

    // Dữ liệu biểu đồ số lượt đăng ký
    const registrationData = {
        labels: sortRegistrationDataTime(data)
            .filter((course: any) => course.name.toLowerCase().includes(searchRegistration.toLowerCase()))
            .slice(0, 30)
            .map((course: any) => course.name),
        datasets: [
            {
                label: 'Số lượt đăng ký',
                data: sortRegistrationDataTime(data)
                    .filter((course: any) => course.name.toLowerCase().includes(searchRegistration.toLowerCase()))
                    .slice(0, 30)
                    .map((course: any) => calculateRegistrations(course)),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu biểu đồ doanh thu
    const revenueData = {
        labels: sortRevenueData(data)
            .filter((course: any) => course.name.toLowerCase().includes(searchRevenue.toLowerCase()))
            .slice(0, 30)
            .map((course: any) => course.name),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: sortRevenueData(data)
                    .filter((course: any) => course.name.toLowerCase().includes(searchRevenue.toLowerCase()))
                    .slice(0, 30)
                    .map((course: any) =>
                        calculateRevenue().find((revenue: any, index: any) => index === data.indexOf(course)),
                    ),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };
    const calculateInstructorRevenue = (
        courses: any[],
        startDate: string | null,
        endDate: string | null,
    ): { [key: string]: number } => {
        const adjustedEndDate = endDate ? new Date(endDate) : null; // Chỉ tạo adjustedEndDate nếu có endDate
        if (adjustedEndDate) {
            adjustedEndDate.setHours(23, 59, 59, 999); // Điều chỉnh giờ kết thúc để bao gồm cả ngày
        }

        return courses.reduce((acc: { [key: string]: number }, course: any) => {
            const filteredUsers = course.registeredUsers.filter((user: any) => {
                const registeredAt = new Date(user.registeredAt);
                return (
                    (!startDate || new Date(startDate) <= registeredAt) &&
                    (!adjustedEndDate || registeredAt <= adjustedEndDate) // Sử dụng adjustedEndDate đã set
                );
            });

            const revenue = course.price === 'Miễn phí' ? 0 : parseInt(course.price) * filteredUsers.length;

            acc[course.userName] = (acc[course.userName] || 0) + revenue;
            return acc;
        }, {});
    };

    // Sắp xếp doanh thu giảng viên
    const sortInstructorDataByTime = (
        data: { [key: string]: number },
        sortOrder: string,
    ): { labels: string[]; data: number[] } => {
        const sortedEntries = Object.entries(data).sort(([_, revenueA], [__, revenueB]) => {
            if (sortOrder === 'asc') return revenueA - revenueB;
            if (sortOrder === 'desc') return revenueB - revenueA;
            return 0; // Không sắp xếp nếu sortOrder trống
        });

        return sortedEntries.reduce(
            (acc, [key, value]) => {
                acc.labels.push(key);
                acc.data.push(value);
                return acc;
            },
            { labels: [] as string[], data: [] as number[] },
        );
    };

    // Dữ liệu doanh thu theo giảng viên
    const filteredRevenueByInstructor = calculateInstructorRevenue(
        data,
        registrationStartDate || null,
        registrationEndDate || null,
    );

    // Sắp xếp dữ liệu doanh thu giảng viên
    const sortedInstructorRevenueData = sortInstructorDataByTime(filteredRevenueByInstructor, sortOrder);

    // Cấu hình biểu đồ
    const instructorData = {
        labels: sortedInstructorRevenueData.labels.filter((instructor) =>
            instructor.toLowerCase().includes(searchInstructor.toLowerCase()),
        ),
        datasets: [
            {
                label: 'Doanh thu',
                data: sortedInstructorRevenueData.data.filter((_, index) =>
                    sortedInstructorRevenueData.labels[index].toLowerCase().includes(searchInstructor.toLowerCase()),
                ),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    // Tổng khóa học và giảng viên
    const totalCourses = data.length;
    // Tính tổng giảng viên dựa trên dữ liệu đã lọc
    const totalInstructors = Object.keys(filteredRevenueByInstructor).length;

    return (
        <div className="space-y-6">
            {/* Biểu đồ số lượt đăng ký */}
            <div className="p-4 bg-white shadow rounded">
                <h2 className="text-lg font-semibold text-center mb-4">Số lượt đăng ký</h2>
                <div className="flex gap-4 mb-4">
                    <input
                        type="date"
                        value={registrationStartDate}
                        onChange={(e) => setRegistrationStartDate(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <input
                        type="date"
                        value={registrationEndDate}
                        onChange={(e) => setRegistrationEndDate(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học"
                        value={searchRegistration}
                        onChange={(e) => setSearchRegistration(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    >
                        <option value="">Mặc định</option>
                        <option value="asc">Từ nhỏ đến lớn</option>
                        <option value="desc">Từ lớn đến nhỏ</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <Bar
                        data={registrationData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { x: { ticks: { font: { size: 10 } } } },
                        }}
                        height={400}
                    />
                </div>
                <p className="mt-2 text-center">Tổng số khóa học: {totalCourses}</p>
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="p-4 bg-white shadow rounded">
                <h2 className="text-lg font-semibold text-center mb-4">
                    {startDate || endDate ? 'Doanh thu theo khoảng thời gian' : 'Tổng doanh thu'}
                </h2>
                <div className="flex gap-4 mb-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học(Nhập đúng tên bao gồm cả dấu và kí tự)"
                        value={searchRevenue}
                        onChange={(e) => setSearchRevenue(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                </div>
                <div className="overflow-x-auto">
                    <Bar
                        data={revenueData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                        }}
                        height={400}
                    />
                </div>
                <p className="mt-2 text-center">Tổng số khóa học: {totalCourses}</p>
            </div>

            {/* Biểu đồ doanh thu theo giảng viên */}
            <div className="p-4 bg-white shadow rounded">
                <h2 className="text-lg font-semibold text-center mb-4">Doanh thu theo giảng viên</h2>
                <div className="flex gap-4 mb-4">
                    <input
                        type="date"
                        value={registrationStartDate}
                        onChange={(e) => setRegistrationStartDate(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <input
                        type="date"
                        value={registrationEndDate}
                        onChange={(e) => setRegistrationEndDate(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm giảng viên(Nhập đúng tên bao gồm cả dấu và kí tự)"
                        value={searchInstructor}
                        onChange={(e) => setSearchInstructor(e.target.value)}
                        className="px-4 py-2 border rounded-md w-full"
                    />
                    <select
                        value={sortInstructorOrder}
                        onChange={(e) => setSortInstructorOrder(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    >
                        <option value="">Mặc định</option>
                        <option value="asc">Từ thấp đến cao</option>
                        <option value="desc">Từ cao đến thấp</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <Bar
                        data={instructorData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                        }}
                        height={400}
                    />
                </div>
                <p className="mt-2 text-center">
                    Tổng số giảng viên: {Object.keys(filteredRevenueByInstructor).length}
                </p>
            </div>
        </div>
    );
}
