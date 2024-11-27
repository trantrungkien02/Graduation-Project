'use client';
import { useEffect, useRef, useState } from 'react';
import {
    createNotify,
    fetchCourseBySlug,
    getLessonBycourseId,
    updateLessonCompleted,
    updateUser,
} from '~/redux/stateglobal/apiRequest';
import Image from 'next/image';
import React from 'react';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/app/createInstance';
import { loginCourseForUserSuccess, loginSuccess } from '~/redux/stateglobal/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCirclePlay,
    faCompactDisc,
    faLock,
    faCircleCheck,
    faChevronLeft,
    faNoteSticky,
    faCircleQuestion,
    faEllipsis,
    faSpinner,
    faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, Menu, message, Modal } from 'antd';
import Link from 'next/link';
import CommentForm from '~/modules/Comment';
import axios from 'axios';
import { images } from '~/assets/images';
import { components } from 'react-big-calendar';
import Quiz from '~/modules/Quiz';

interface CourseDetailPageProps {
    params: { slug: string };
}

interface Lesson {
    _id: string;
    name: string;
    videoId: string;
    duration: string;
    type: string;
    quesList: Question[];
    createdAt?: string;
    locked?: boolean;
}

type Question = {
    a: string;
    b: string;
    c: string;
    d: string;
    explanation: string;
    quesCorrect: string;
    quesName: string;
    _id: string;
    [key: string]: string;
};
type Reply = {
    userId: string;
    fullName: string;
    text: string;
    avatarUrl: string;
    timestamp: string;
    comId: string;
    _id: string;
};

type Comment = {
    _id: string;
    userId: string;
    lessonId: string;
    fullName: string;
    text: string;
    avatarUrl: string;
    comId: string;
    timestamp: string;
    replies: Reply[];
};

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const quillRef = useRef<ReactQuill | null>(null); // Tham chiếu tới ReactQuill

    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [player, setPlayer] = useState<any>(null);
    const [indexLesson, setIndexLesson] = useState(0);
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const [valueQuill, setValueQuill] = useState('');
    const [valueQuillRecomment, setValueQuillRecomment] = useState('');
    const [isQuizPassed, setIsQuizPassed] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const [isQuill, setIsQuill] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditComment, setIsEditComment] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
    const [commentData, setCommentData] = useState({
        userId: '',
        lessonId: '',
        fullName: '',
        text: valueQuill,
        avatarUrl: 'https://www.gravatar.com/avatar/7cf67a48f99e0b3621388d153627210a.jpg?s=80&d=mp&r=g',
        timestamp: new Date().toISOString(),
        replies: [],
    });
    // Define activeReplyId to accept both string and null
    // // Để theo dõi phản hồi nào đang hiển thị ReactQuill
    // useEffect(() => {
    //     if (activeReplyId && quillRef.current) {
    //         // Khi activeReplyId là true và quillRef đã được khởi tạo, tự động focus vào ReactQuill
    //         quillRef.current.focus();
    //     }
    // }, [activeReplyId]);
    const handleRecommentBtn = (replyId: any) => {
        // Nếu người dùng nhấn vào phản hồi đang hiển thị ReactQuill, tắt nó đi
        if (activeReplyId === replyId) {
            setActiveReplyId(null);
        } else {
            setActiveReplyId(replyId); // Nếu nhấn vào phản hồi khác, hiển thị ReactQuill ở đó
        }
    };
    const handleQuizComplete = (isPassed: boolean) => {
        setIsQuizPassed(isPassed);
    };
    useEffect(() => {
        if (isQuizPassed || videoEnded) {
            unlockNextLesson(); // Mở khóa bài học tiếp theo
        }
    }, [isQuizPassed, videoEnded]);

    const [comments, setComments] = useState([]);
    const fetchComments = async (lessonId: any) => {
        try {
            const response = await axiosJWT.get(`http://localhost:8000/v1/comment/getcommentsbylessonid/${lessonId}`);
            setComments(response.data); // Cập nhật dữ liệu nhận được từ API
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseData = await fetchCourseBySlug(params.slug);
                setCourse(courseData);

                const lessonsData = await getLessonBycourseId(user?.accessToken, courseData._id, dispatch, axiosJWT);
                setLessons(lessonsData);

                const lessonIdFromUrl = new URLSearchParams(window.location.search).get('id');
                const initialLesson = lessonIdFromUrl
                    ? lessonsData.find((lesson: any) => lesson._id === lessonIdFromUrl)
                    : lessonsData[0];
                setSelectedLesson(initialLesson || lessonsData[0]);
                if (initialLesson || lessonsData[0]) {
                    fetchComments(initialLesson ? initialLesson._id : lessonsData[0]._id);
                    console.log(comments);
                }
                setCommentData({
                    userId: user._id,
                    lessonId: initialLesson ? initialLesson._id : lessonsData[0]._id,
                    fullName: user.username,
                    text: valueQuill,
                    avatarUrl: 'https://www.gravatar.com/avatar/7cf67a48f99e0b3621388d153627210a.jpg?s=80&d=mp&r=g',
                    timestamp: new Date().toISOString(),
                    replies: [],
                });
            } catch (error) {
                console.error('Error fetching course or lessons data:', error);
            }
        };

        fetchData();
    }, [params.slug]);

    useEffect(() => {
        if (selectedLesson) {
            // Load YouTube Iframe API if not already loaded
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

                // Initialize the player once the API is ready
                window.onYouTubeIframeAPIReady = initializePlayer;
            } else {
                initializePlayer();
            }
        }
    }, [selectedLesson]); // Ensure this runs each time selectedLesson changes

    const initializePlayer = () => {
        if (!selectedLesson) return;

        // If player exists, destroy it before creating a new one
        if (player) {
            player.destroy();
        }

        const newPlayer = new window.YT.Player('video-player', {
            videoId: selectedLesson.videoId,
            events: {
                onStateChange: onPlayerStateChange,
            },
        });
        setPlayer(newPlayer); // Update the player state to hold the new player instance
    };

    const onPlayerStateChange = async (event: any) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            setVideoEnded(true); // Đánh dấu video đã kết thúc
        }
    };
    const unlockNextLesson = async () => {
        if (!user) return;

        const currentCourse1 = user.registeredCourses.find((currentCourse: any) => {
            return currentCourse.courseId == course._id;
        });

        if (!currentCourse1) return;

        const currentLessonsCompleted = currentCourse1.lessonsCompleted || 0;
        const updatedLessonsCompleted = currentLessonsCompleted + 1;
        console.log(currentLessonsCompleted, indexLesson, updatedLessonsCompleted);
        if (currentLessonsCompleted == indexLesson) {
            console.log('đã chạy unlock');
            const updatedRegisteredCourses = user.registeredCourses.map((course: any) => {
                if (course.courseId === currentCourse1.courseId) {
                    return {
                        ...course,
                        lessonsCompleted: updatedLessonsCompleted,
                    };
                }
                return course;
            });

            const { accessToken, ...userWithoutToken } = user;

            const updatedUser = {
                ...userWithoutToken,
                registeredCourses: updatedRegisteredCourses,
            };

            const updatedUserData = await updateUser(updatedUser, dispatch);
            await updateLessonCompleted(dispatch, course._id, user?._id, axiosJWT);
            dispatch(loginCourseForUserSuccess(updatedUserData));
            setVideoEnded(false);
            setIsQuizPassed(false);
        }

        setLessons(
            lessons.map((lesson, index) => {
                const updatedLesson = { ...lesson };
                if (index <= updatedLessonsCompleted) {
                    updatedLesson.locked = false;
                }
                return updatedLesson;
            }),
        );
        console.log('đã chạy unlock');
    };

    const handleLessonClick = (lesson: Lesson, index: number) => {
        setCommentData({
            userId: user._id,
            lessonId: lesson._id,
            fullName: user.username,
            text: valueQuill,
            avatarUrl: 'https://www.gravatar.com/avatar/7cf67a48f99e0b3621388d153627210a.jpg?s=80&d=mp&r=g',
            timestamp: new Date().toISOString(),
            replies: [],
        });
        fetchComments(lesson._id);
        setIndexLesson(index);
        console.log(index);
        const currentCourse = user?.registeredCourses.find((currentCourse: any) => {
            return currentCourse.courseId == course._id;
        });
        console.log(currentCourse);
        const lessonsCompleted = currentCourse ? currentCourse.lessonsCompleted : 0;
        console.log(index, lessonsCompleted);

        // Kiểm tra nếu bài học bị khóa
        if (index > lessonsCompleted) {
            message.error('Bạn cần hoàn thành bài học trước để tiếp tục!!');
        } else {
            setSelectedLesson(lesson); // Cập nhật bài học được chọn khi click
            router.push(`/learning/${params.slug}?id=${lesson._id}`); // Chuyển hướng tới bài học đã chọn
        }
    };
    const handleComment = async () => {
        try {
            const updatedCommentData = {
                ...commentData,
                text: valueQuill,
            };
            console.log(updatedCommentData);

            await axios.post('http://localhost:8000/v1/comment/create', updatedCommentData);

            await fetchComments(commentData.lessonId);

            // Xóa nội dung trong ô nhập liệu Quill sau khi gửi bình luận
            setValueQuill('');
            setActiveReplyId(null);
            setIsQuill(false);
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleRecomment = async (comment: any, reply: any) => {
        try {
            console.log(comment);
            const { lessonId, ...commentWithoutLessonId } = commentData;
            const updatedRecommentData = {
                ...commentWithoutLessonId,
                text: valueQuillRecomment,
            };
            console.log(updatedRecommentData);

            await axios.post(`http://localhost:8000/v1/comment/addreply/${comment._id}`, updatedRecommentData);

            await fetchComments(commentData.lessonId);

            const notifyData = {
                senderId: updatedRecommentData.userId,
                senderName: updatedRecommentData.fullName,
                receiverId: reply === '' ? comment.userId : reply.userId,
                tittle: `${updatedRecommentData.fullName} đã trả lời bình luận của bạn`,
                type: 'comment',
                des: valueQuillRecomment,
                lessonId: comment.lessonId,
                courseId: course.slug,
            };
            await createNotify(notifyData, axiosJWT);
            // Xóa nội dung trong ô nhập liệu Quill sau khi gửi bình luận
            setValueQuill('');
            setValueQuillRecomment('');
            setActiveReplyId(null);
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    if (!course || !selectedLesson) {
        return (
            <div className="loading-overlay">
                <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-[30px] mt-[5px] text-[#555] hover:text-[#0b3a82] motion-preset-spin "
                />
            </div>
        );
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePostComment = () => {
        alert('da post');
    };

    // Cấu hình toolbar của Quill để thêm nút "Tải hình"
    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
            [{ align: [] }],
            ['link'],
            ['image'], // Thêm nút tải hình
        ],
    };

    // Define handler functions for each action
    const handleEditComment = async (commentId: any) => {
        try {
            setIsEditComment(true);
            const res = await axios.get(`http://localhost:8000/v1/comment/getcommentbyid/${commentId}`);
            console.log(res.data);
            setValueQuillRecomment(res.data);
            setActiveReplyId(commentId);
        } catch (error) {
            console.log(error);
        }
        // Code to edit the comment
        console.log('Edit comment', commentId);
    };

    const handleEditReply = async (commentId: any, replyId: any) => {
        try {
            setIsEditComment(true);
            const res = await axios.get(`http://localhost:8000/v1/comment/${commentId}/getreplybyid/${replyId}`);
            console.log(res.data);
            setValueQuillRecomment(res.data);
            setActiveReplyId(replyId);
        } catch (error) {
            console.log(error);
        }
        // Code to edit the comment
        console.log('Edit comment', commentId);
    };

    const handleUpdateComment = async (commentId: any, lessonId: any) => {
        try {
            await axios.put(`http://localhost:8000/v1/comment/update/${commentId}`, {
                text: valueQuillRecomment,
            });
            setActiveReplyId(null);
            setValueQuillRecomment('');
            setIsEditComment(false);
            fetchComments(lessonId);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateReply = async (commentId: any, lessonId: any, replyId: any) => {
        try {
            await axios.put(`http://localhost:8000/v1/comment/${commentId}/updatereply/${replyId}`, {
                text: valueQuillRecomment,
            });
            setActiveReplyId(null);
            setValueQuillRecomment('');
            setIsEditComment(false);
            fetchComments(lessonId);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async (commentId: any, lessonId: any) => {
        try {
            await axios.delete(`http://localhost:8000/v1/comment/delete/${commentId}`);
            fetchComments(lessonId);
        } catch (error) {
            console.log(error);
        }
        console.log('Delete comment', commentId);
    };

    const handleDeleteReply = async (commentId: any, lessonId: any, replyId: any) => {
        try {
            await axios.delete(`http://localhost:8000/v1/comment/${commentId}/deletereply/${replyId}`);
            fetchComments(lessonId);
        } catch (error) {
            console.log(error);
        }
        console.log('Delete comment', commentId);
    };

    const handleReportComment = (commentId: any) => {
        // Code to report the comment
        console.log('Report comment', commentId);
    };

    const insertMentionWithColor = (fullName: string) => {
        const mentionText = `@${fullName}:  `; // Thêm dấu cách sau tên người dùng
        const coloredMention = `<span style="color: #0073b1;">${mentionText}</span>`; // Đặt màu xanh cho tên người dùng
        setValueQuillRecomment(fullName === user.username ? '' : coloredMention); // Cập nhật giá trị của Quill với tên người dùng

        // Đặt vị trí con trỏ ngay sau tên người dùng + dấu cách
        setTimeout(() => {
            const editor = quillRef.current?.getEditor(); // Lấy editor từ quillRef
            if (editor) {
                // Tính vị trí ngay sau tên người dùng và dấu cách
                const mentionLength = mentionText.length;
                editor.setSelection(mentionLength, mentionLength); // Đặt con trỏ ngay sau tên người dùng và dấu cách
            }
        }, 0);
    };
    return (
        <div className="h-full">
            <div className="navbar-learn">
                <div className="logo">
                    <Link href="/">
                        <FontAwesomeIcon icon={faChevronLeft} className="mr-8 text-[16px] text-[#fff]" />
                    </Link>
                    <span className="text-[16px] font-bold text-[#fff]">{course.name}</span>
                </div>

                <div className="right-section flex items-center">
                    <div className="progress-section flex items-center ">
                        <div className="h-8 w-8 mx-2">
                            <CircularProgressbar
                                value={
                                    // Tính tỷ lệ phần trăm và làm tròn
                                    user?.registeredCourses.find(
                                        (currentCourse: any) => currentCourse.courseId == course._id,
                                    )
                                        ? Math.round(
                                              (user.registeredCourses.find(
                                                  (currentCourse: any) => currentCourse.courseId == course._id,
                                              )?.lessonsCompleted /
                                                  lessons.length) *
                                                  100,
                                          )
                                        : 0 // Nếu chưa có dữ liệu
                                }
                                text={
                                    // Hiển thị số bài học đã hoàn thành và tổng số bài học
                                    user?.registeredCourses.find(
                                        (currentCourse: any) => currentCourse.courseId == course._id,
                                    )
                                        ? `${Math.round(
                                              (user.registeredCourses.find(
                                                  (currentCourse: any) => currentCourse.courseId == course._id,
                                              )?.lessonsCompleted /
                                                  lessons.length) *
                                                  100,
                                          )}%`
                                        : 'Loading...'
                                }
                                styles={{
                                    text: {
                                        fontSize: '30px', // Tăng kích thước văn bản
                                        fill: '#fff', // Màu sắc văn bản
                                    },
                                }}
                            />
                        </div>
                        <span className="lesson-progress">
                            {user?.registeredCourses.find((currentCourse: any) => currentCourse.courseId == course._id)
                                ? `${user.registeredCourses.find((currentCourse: any) => currentCourse.courseId == course._id).lessonsCompleted}/${lessons.length} Bài học`
                                : 'Loading...'}
                        </span>
                    </div>
                    <a href="#">
                        <FontAwesomeIcon icon={faNoteSticky} className="ml-5 text-[14px] text-[#fff]" /> Ghi chú
                    </a>
                    <a href="#">
                        <FontAwesomeIcon icon={faCircleQuestion} className="ml-5 text-[14px] text-[#fff]" /> Hướng dẫn
                    </a>
                </div>
            </div>
            <div className="flex">
                <div className="w-3/4 video-container-learn course-detail-page">
                    {/* YouTube Player */}
                    {selectedLesson.type === 'question' ? (
                        <div>
                            <Quiz quesList={selectedLesson.quesList} onQuizComplete={() => handleQuizComplete(true)} />
                        </div>
                    ) : (
                        <div id="video-player" className="w-full h-[686px]"></div>
                    )}
                    <div className="w-full py-10 px-[100px]">
                        <h1 className="text-3xl font-bold mb-2">{selectedLesson.name}</h1>
                        {selectedLesson.createdAt && (
                            <p className="text-gray-500 mb-5"> Cập nhật&nbsp;{formatDate(selectedLesson.createdAt)}</p>
                        )}
                        <p className="text-lg mb-4">
                            Tham gia các cộng đồng để cùng học hỏi, chia sẻ kinh nghiệm học tập và làm việc nhé!
                        </p>
                        <div className="flex justify-between items-center border-t pt-5">
                            <div className="text-gray-500">
                                Made with <span className="text-red-500">❤</span> • Powered by KTGruop
                            </div>
                        </div>
                        <button
                            className="fixed bottom-5 right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600"
                            onClick={showModal}
                        >
                            Hỏi đáp
                        </button>
                        <Modal
                            title="Hỏi đáp"
                            visible={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={null} // Hide the default footer (Ok and Cancel buttons)
                            width={825}
                            style={{ top: 0, position: 'absolute', right: 0, bottom: 0 }} // Set height if needed
                        >
                            <div className="comment-modal">
                                <div className="container-fluid line-numbers">
                                    <div className="flex items-center gap-2">
                                        <Image alt="" src={images.avtUser} className="rounded-[50%] w-[40px]" />
                                        {!isQuill ? (
                                            <div
                                                className="comment-plahoder"
                                                onClick={() => {
                                                    setIsQuill(!isQuill);
                                                }}
                                            >
                                                Nhập bình luận mới của bạn
                                            </div>
                                        ) : (
                                            <div className="w-full">
                                                <ReactQuill
                                                    ref={quillRef}
                                                    theme="snow"
                                                    value={valueQuill}
                                                    onChange={setValueQuill}
                                                    modules={modules}
                                                    className="w-full rouned-[16px]"
                                                />
                                                <div className="my-5">
                                                    <Button
                                                        className="rounded-[10px] w-[120px] h-[40px] mr-2"
                                                        onClick={() => {
                                                            setIsQuill(!isQuill);
                                                        }}
                                                    >
                                                        Hủy
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        className="rounded-[10px] w-[120px] h-[40px]"
                                                        onClick={handleComment}
                                                    >
                                                        Bình Luận
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="comments-container">
                                        {comments
                                            .slice()
                                            .reverse()
                                            .map((comment: Comment) => (
                                                <div key={comment._id} className="comment">
                                                    <Image src={images.avtUser} alt="avatar" className="avatar" />
                                                    <div className="comment-content">
                                                        <div className="comment-header">
                                                            <span className="comment-author">{comment.fullName}</span>
                                                            <span className="comment-time">
                                                                {new Date(comment.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className="comment-text"
                                                            dangerouslySetInnerHTML={{ __html: comment.text }}
                                                        ></p>

                                                        <div className="comment-actions justify-between">
                                                            <div className="flex">
                                                                <span className="mr-3">Thích</span>
                                                                <span
                                                                    onClick={() => {
                                                                        setActiveReplyId(comment._id);
                                                                        insertMentionWithColor(comment.fullName);
                                                                    }}
                                                                >
                                                                    Phản hồi
                                                                </span>
                                                            </div>
                                                            <Dropdown
                                                                overlay={
                                                                    <Menu>
                                                                        {comment.userId === user._id ||
                                                                        course.userId === user._id ? (
                                                                            <>
                                                                                <Menu.Item
                                                                                    key="edit"
                                                                                    onClick={() =>
                                                                                        handleEditComment(comment._id)
                                                                                    }
                                                                                >
                                                                                    Sửa bình luận
                                                                                </Menu.Item>
                                                                                <Menu.Item
                                                                                    key="delete"
                                                                                    onClick={() =>
                                                                                        handleDeleteComment(
                                                                                            comment._id,
                                                                                            comment.lessonId,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Xóa bình luận
                                                                                </Menu.Item>
                                                                            </>
                                                                        ) : null}
                                                                        <Menu.Item
                                                                            key="report"
                                                                            onClick={() =>
                                                                                handleReportComment(comment._id)
                                                                            }
                                                                        >
                                                                            Báo cáo vi phạm
                                                                        </Menu.Item>
                                                                    </Menu>
                                                                }
                                                                trigger={['click']}
                                                                placement="bottomRight"
                                                                overlayClassName="drop-comment"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faEllipsis}
                                                                    className="ml-5 text-[14px] text-[#515fad] cursor-pointer"
                                                                />
                                                            </Dropdown>
                                                        </div>
                                                        {/* Top-level ReactQuill for comments */}
                                                        {activeReplyId === comment._id && (
                                                            <div className="react-quill-container">
                                                                <ReactQuill
                                                                    ref={quillRef}
                                                                    theme="snow"
                                                                    value={valueQuillRecomment}
                                                                    onChange={setValueQuillRecomment}
                                                                    modules={modules}
                                                                    className="w-full rounded-[16px]"
                                                                />
                                                                <div className="my-5">
                                                                    <Button
                                                                        className="rounded-[10px] w-[120px] h-[40px] mr-2"
                                                                        onClick={() => setActiveReplyId(null)} // Tắt ReactQuill
                                                                    >
                                                                        Hủy
                                                                    </Button>
                                                                    {!isEditComment ? (
                                                                        <Button
                                                                            type="primary"
                                                                            className="rounded-[10px] w-[120px] h-[40px]"
                                                                            onClick={() => handleRecomment(comment, '')} // Gửi ph}
                                                                        >
                                                                            Bình Luận
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            type="primary"
                                                                            className="rounded-[10px] w-[120px] h-[40px]"
                                                                            onClick={() =>
                                                                                handleUpdateComment(
                                                                                    comment._id,
                                                                                    comment.lessonId,
                                                                                )
                                                                            }
                                                                        >
                                                                            Chỉnh sửa
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* Replies */}
                                                        {comment.replies && comment.replies.length > 0 && (
                                                            <div className="replies">
                                                                {comment.replies.map((reply) => (
                                                                    <div key={reply._id}>
                                                                        <div className="reply">
                                                                            <Image
                                                                                src={images.avtUser}
                                                                                alt="avatar"
                                                                                className="avatar"
                                                                            />
                                                                            <div className="reply-content">
                                                                                <div className="reply-header">
                                                                                    <span className="reply-author">
                                                                                        {reply.fullName}
                                                                                    </span>
                                                                                    <span className="reply-time">
                                                                                        {new Date(
                                                                                            reply.timestamp,
                                                                                        ).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="reply-text">
                                                                                    {reply.text}
                                                                                </p>
                                                                                <div className="comment-actions justify-between">
                                                                                    <div className="flex">
                                                                                        <span className="mr-3">
                                                                                            Thích
                                                                                        </span>
                                                                                        <span
                                                                                            onClick={() => {
                                                                                                setActiveReplyId(
                                                                                                    reply._id,
                                                                                                );
                                                                                                insertMentionWithColor(
                                                                                                    reply.fullName,
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            Phản hồi
                                                                                        </span>
                                                                                    </div>
                                                                                    <Dropdown
                                                                                        overlay={
                                                                                            <Menu>
                                                                                                {reply.userId ===
                                                                                                user._id ? (
                                                                                                    <>
                                                                                                        <Menu.Item
                                                                                                            key="edit"
                                                                                                            onClick={() =>
                                                                                                                handleEditReply(
                                                                                                                    comment._id,
                                                                                                                    reply._id,
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Sửa bình
                                                                                                            luận
                                                                                                        </Menu.Item>
                                                                                                        <Menu.Item
                                                                                                            key="delete"
                                                                                                            onClick={() =>
                                                                                                                handleDeleteReply(
                                                                                                                    comment._id,
                                                                                                                    comment.lessonId,
                                                                                                                    reply._id,
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Xóa bình
                                                                                                            luận
                                                                                                        </Menu.Item>
                                                                                                    </>
                                                                                                ) : null}
                                                                                                <Menu.Item
                                                                                                    key="report"
                                                                                                    onClick={() =>
                                                                                                        handleReportComment(
                                                                                                            comment._id,
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Báo cáo vi phạm
                                                                                                </Menu.Item>
                                                                                            </Menu>
                                                                                        }
                                                                                        trigger={['click']}
                                                                                        placement="bottomRight"
                                                                                        overlayClassName="drop-comment"
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={faEllipsis}
                                                                                            className="ml-5 text-[14px] text-[#515fad] cursor-pointer"
                                                                                        />
                                                                                    </Dropdown>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {activeReplyId === reply._id && (
                                                                            <div className="react-quill-container">
                                                                                <ReactQuill
                                                                                    ref={quillRef}
                                                                                    theme="snow"
                                                                                    value={valueQuillRecomment}
                                                                                    onChange={setValueQuillRecomment}
                                                                                    modules={modules}
                                                                                    className="w-full rounded-[16px]"
                                                                                />
                                                                                <div className="my-5">
                                                                                    <Button
                                                                                        className="rounded-[10px] w-[120px] h-[40px] mr-2"
                                                                                        onClick={() =>
                                                                                            setActiveReplyId(null)
                                                                                        } // Tắt ReactQuill
                                                                                    >
                                                                                        Hủy
                                                                                    </Button>
                                                                                    {!isEditComment ? (
                                                                                        <Button
                                                                                            type="primary"
                                                                                            className="rounded-[10px] w-[120px] h-[40px]"
                                                                                            onClick={() =>
                                                                                                handleRecomment(
                                                                                                    comment,
                                                                                                    reply,
                                                                                                )
                                                                                            } // Gửi ph}
                                                                                        >
                                                                                            Bình Luận
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <Button
                                                                                            type="primary"
                                                                                            className="rounded-[10px] w-[120px] h-[40px]"
                                                                                            onClick={() =>
                                                                                                handleUpdateReply(
                                                                                                    comment._id,
                                                                                                    comment.lessonId,
                                                                                                    reply._id,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Chỉnh sửa
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
                <div className="w-1/4 px-3">
                    <div className="detail-course">Nội dung khóa học</div>
                    <ul className="lesson-list">
                        {lessons.map((lesson, index) => {
                            // Tìm khóa học tương ứng với lesson (dựa trên courseId)
                            const currentCourse = user?.registeredCourses.find((currentCourse: any) => {
                                return currentCourse.courseId == course._id;
                            });
                            // Nếu không tìm thấy khóa học, mặc định lessonsCompleted là 0
                            const lessonsCompleted = currentCourse ? currentCourse.lessonsCompleted : 0;

                            // Xác định bài học có bị khóa không
                            const isLocked = index > lessonsCompleted;
                            const isChecked = index < lessonsCompleted;
                            return (
                                <li
                                    key={lesson._id}
                                    className={`lesson-item-learning ${lesson._id === selectedLesson._id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                                    onClick={() => handleLessonClick(lesson, index)}
                                    style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div>
                                                <span className="lesson-name">
                                                    {index + 1}. {lesson.name}
                                                </span>
                                            </div>
                                            <div>
                                                {lesson._id === selectedLesson._id ? (
                                                    <FontAwesomeIcon
                                                        icon={faCompactDisc}
                                                        className="mr-2 text-[14px] text-[#1261a6]"
                                                    />
                                                ) : lesson.type === 'video' ? (
                                                    <FontAwesomeIcon
                                                        icon={faCirclePlay}
                                                        className="mr-2 text-[14px] text-[#666]"
                                                    />
                                                ) : lesson.type === 'question' ? (
                                                    <FontAwesomeIcon
                                                        icon={faFileLines}
                                                        className="mr-2 text-[14px] text-[#666]"
                                                    />
                                                ) : null}

                                                <span className="text-[14px]">{lesson.duration || '00:00:00'} </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            {!isLocked ? (
                                                isChecked ? (
                                                    <FontAwesomeIcon
                                                        icon={faCircleCheck}
                                                        className="mr-3 text-[18px] text-[#1261a6] "
                                                    />
                                                ) : (
                                                    <div></div>
                                                )
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faLock}
                                                    className="mr-3 text-[18px] text-[#666]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
