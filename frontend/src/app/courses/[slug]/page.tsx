'use client';
import { useEffect, useState } from 'react';
import { fetchCourseBySlug } from '~/redux/stateglobal/apiRequest';

interface CourseDetailPageProps {
    params: { slug: string }; // Nhận giá trị slug từ URL
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const [course, setCourse] = useState<any>(null);

    useEffect(() => {
        // Gọi hàm fetchCourseBySlug để lấy dữ liệu khóa học
        const fetchData = async () => {
            try {
                const courseData = await fetchCourseBySlug(params.slug);
                setCourse(courseData); // Lưu dữ liệu vào state
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchData();
    }, [params.slug]);

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{course.name}</h1>
            <p>{course.description}</p>
            {/* Hiển thị các thông tin chi tiết khác của khóa học */}
        </div>
    );
}
