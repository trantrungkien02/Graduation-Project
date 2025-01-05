import React from 'react';
import CourseDetailPage from '~/modules/CourseDetail';

interface CourseDetailPageProps {
    params: { slug: string };
}

const page = ({ params }: CourseDetailPageProps) => {
    return <CourseDetailPage params={params} />;
};

export default page;
