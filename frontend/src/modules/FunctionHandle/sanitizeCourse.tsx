import DOMPurify from 'dompurify';

type Course = {
    tittle: string;
    require: string;
    result: string;
    des: string;
};

const sanitizeCourse = (course: Course): Course => {
    return {
        tittle: DOMPurify.sanitize(course.tittle),
        require: DOMPurify.sanitize(course.require),
        result: DOMPurify.sanitize(course.result),
        des: DOMPurify.sanitize(course.des),
    };
};
export default sanitizeCourse;
