'use client';
import { useEffect, useState } from 'react';
import { Button, Input, Select, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { createAxios } from '~/app/createInstance';
import { loginSuccess } from '~/redux/stateglobal/authSlice';
import { deleteCourse, getAllCoursesByIdUser, searchCourses, updateCourse } from '~/redux/stateglobal/apiRequest';

const CourseList = () => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    const courseList = useSelector((state: any) => state.course.courses?.allCoursesById ?? []);
    const dispatch = useDispatch();
    const router = useRouter();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    // State to handle search query and edit state
    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('name'); // Trường tìm kiếm mặc định
    const [editingCourse, setEditingCourse] = useState<any>(null); // Trạng thái đang edit

    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    // Fetch course data
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
        if (user?.accessToken) {
            getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
        }
    }, []);

    // Effect to handle search query changes
    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(async () => {
            if (searchText) {
                await searchCourses(user?.accessToken, dispatch, axiosJWT, searchField, searchText);
            } else {
                await getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
            }
        }, 300);

        setDebounceTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [searchText, searchField]);

    const handleDelete = (id: any) => {
        Modal.confirm({
            title: 'Xác nhận xóa khóa học',
            content: 'Bạn có chắc chắn muốn xóa khóa học này không?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                await deleteCourse(user?.accessToken, dispatch, id, axiosJWT);
                if (user?.accessToken) {
                    getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
                }
            },
        });
    };

    const handleEdit = (course: any) => {
        setEditingCourse({ ...course });
    };

    const handleSaveEdit = async () => {
        if (editingCourse) {
            await updateCourse(user?.accessToken, dispatch, editingCourse, axiosJWT);
            setEditingCourse(null);
            getAllCoursesByIdUser(user?.accessToken, user._id, dispatch, axiosJWT);
        }
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setEditingCourse((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="home-container pl-[40px] pr-[50px]">
            <div className="user-title">Danh sách khóa học</div>

            {/* Search Section */}
            <Input.Group compact style={{ marginBottom: '20px', borderRadius: '20px' }}>
                <Select defaultValue="name" onChange={setSearchField} style={{ width: '10%', borderRadius: '20px' }}>
                    <Select.Option value="name">Tên</Select.Option>
                    <Select.Option value="videoId">Video Id</Select.Option>
                    <Select.Option value="price">Giá</Select.Option>
                </Select>
                <Input.Search
                    placeholder="Tìm kiếm"
                    onChange={(e) => setSearchText(e.target.value)}
                    enterButton
                    style={{ width: '90%', borderRadius: '20px' }}
                />
            </Input.Group>

            {/* HTML Table */}
            <table className="course-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>STT</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Tên</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Video Id</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Giá</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {courseList.length > 0 ? (
                        courseList.map((course: any, index: number) => (
                            <tr key={course._id}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {editingCourse?._id === course._id ? (
                                        <Input value={editingCourse.name} name="name" onChange={handleInputChange} />
                                    ) : (
                                        course.name
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {editingCourse?._id === course._id ? (
                                        <Input
                                            value={editingCourse.videoId}
                                            name="videoId"
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        course.videoId
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {editingCourse?._id === course._id ? (
                                        <Input value={editingCourse.price} name="price" onChange={handleInputChange} />
                                    ) : (
                                        course.price
                                    )}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {editingCourse?._id === course._id ? (
                                        <>
                                            <Button onClick={handleSaveEdit}>Save</Button>
                                            <Button onClick={handleCancelEdit}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => handleEdit(course)}>Edit</Button>
                                            <Button
                                                onClick={() => handleDelete(course._id)}
                                                style={{
                                                    backgroundColor: '#b80000',
                                                    borderColor: '#b80000',
                                                    borderRadius: '5px',
                                                    color: 'white',
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '8px' }}>
                                Không có khóa học nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CourseList;
