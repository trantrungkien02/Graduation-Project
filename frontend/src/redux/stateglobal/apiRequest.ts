import axios from 'axios';
import { Dispatch } from 'redux';
import {
    loginCourseForUserSuccess,
    loginFailed,
    loginStart,
    loginSuccess,
    logOutFailed,
    logOutStart,
    logOutSuccess,
    registerFailed,
    registerStart,
    registerSuccess,
    updateUserFailed,
    updateUserStart,
    updateUserSuccess,
} from './authSlice';
import {
    deleteUserFailed,
    deleteUsersSuccess,
    deleteUserStart,
    getUsersFailed,
    getUsersStart,
    getUsersSuccess,
} from './userSlice';
import {
    deleteCoursesFailed,
    deleteCoursesSuccess,
    deleteCoursestart,
    getCoursesByIdFailed,
    getCoursesByIdStart,
    getCoursesByIdSuccess,
    getCoursesFailed,
    getCoursesStart,
    getCoursesSuccess,
    logOutCoursesFailed,
    logOutCoursesStart,
    logOutCoursesSuccess,
    registerCourseFailed,
    registerCourseStart,
    registerCourseSuccess,
} from './courseSlice';
import {
    deleteLessonFailed,
    deleteLessonStart,
    deleteLessonSuccess,
    getLessonsByIdFailed,
    getLessonsByIdStart,
    getLessonsByIdSuccess,
    logOutLessonFailed,
    logOutLessonStart,
    logOutLessonSuccess,
    registerLessonFailed,
    registerLessonStart,
    registerLessonSuccess,
} from './lessonSlice';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

interface User {
    username: string;
    password: string;
}

interface AxiosJWT {
    get: Function;
    put: Function;
    delete: Function;
    post: Function;
}
// API USER
export const loginUser = async (user: any, dispatch: Dispatch, router: any) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/auth/login', user);
        console.log(res);
        dispatch(loginSuccess(res.data));
        router.push('/');
    } catch (err: any) {
        if (err.response) {
            console.log(err.response.data);
            return err.response.data;
        } else {
            console.log(err);
        }
        dispatch(loginFailed());
    }
};

export const registerUser = async (user: any, dispatch: Dispatch) => {
    dispatch(registerStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/auth/register', user);
        dispatch(registerSuccess());

        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
        dispatch(registerFailed());
    }
};

export const getAllUsers = async (accessToken: string, dispatch: Dispatch, axiosJWT: AxiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get('http://localhost:8000/v1/user', {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getUsersFailed());
    }
};

export const searchUsers = async (
    accessToken: string,
    dispatch: Dispatch,
    axiosJWT: AxiosJWT,
    field: string,
    query: string,
) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/user/search?field=${field}&q=${query}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getUsersFailed());
    }
};

export const updateUser = async (user: any, dispatch: Dispatch) => {
    dispatch(updateUserStart());
    try {
        const res = await axios.put('http://localhost:8000/v1/user/update-user', user);
        dispatch(loginCourseForUserSuccess(res.data));

        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response.data);
            return err.response.data;
        } else {
            console.log(err);
        }
        dispatch(updateUserFailed());
    }
};

export const deleteUser = async (accessToken: string, dispatch: Dispatch, id: string, axiosJWT: AxiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete('http://localhost:8000/v1/user/' + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUsersSuccess(res.data));
    } catch (err: any) {
        dispatch(deleteUserFailed(err.response.data));
    }
};

export const logOut = async (dispatch: Dispatch, id: string, router: any, accessToken: string, axiosJWT: AxiosJWT) => {
    dispatch(logOutStart());
    dispatch(logOutCoursesStart());
    dispatch(logOutLessonStart());

    try {
        await axiosJWT.post('http://localhost:8000/v1/auth/logout', id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        dispatch(logOutCoursesSuccess());
        dispatch(logOutLessonSuccess());

        router.push('/login');
    } catch (err) {
        dispatch(logOutFailed());
        dispatch(logOutCoursesFailed());
        dispatch(logOutLessonFailed());
        console.log(err);
    }
};

// API COURSE

export const getAllCourses = async (dispatch: Dispatch, axiosJWT: AxiosJWT) => {
    dispatch(getCoursesStart());
    try {
        const res = await axiosJWT.get('http://localhost:8000/v1/course/getallcourses', {});
        dispatch(getCoursesSuccess(res.data));
    } catch (err) {
        dispatch(getCoursesFailed());
    }
};

export const getAllCoursesByIdUser = async (
    accessToken: string,
    userId: string,
    dispatch: Dispatch,
    axiosJWT: AxiosJWT,
) => {
    dispatch(getCoursesByIdStart());
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/course/getallcoursesbyid/` + userId, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getCoursesByIdSuccess(res.data));
        return res.data;
    } catch (err) {
        dispatch(getCoursesByIdFailed());
        return [];
    }
};

export const getCourseById = async (accessToken: string, Id: string, dispatch: Dispatch, axiosJWT: AxiosJWT) => {
    dispatch(getCoursesByIdStart());
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/course/getcoursebyid/` + Id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getCoursesByIdSuccess(res.data));
        return res.data;
    } catch (err) {
        dispatch(getCoursesByIdFailed());
        return [];
    }
};

export const searchCourses = async (
    accessToken: string,
    dispatch: Dispatch,
    axiosJWT: AxiosJWT,
    field: string,
    query: string,
    userId: string,
) => {
    dispatch(getCoursesByIdStart());
    try {
        const res = await axiosJWT.get(
            `http://localhost:8000/v1/course/search?field=${field}&q=${query}&userId=${userId}`,
            {
                headers: { token: `Bearer ${accessToken}` },
            },
        );
        dispatch(getCoursesByIdSuccess(res.data));
        return res.data;
    } catch (err) {
        dispatch(getCoursesByIdFailed());
    }
};

export const registerCourse = async (course: any, dispatch: Dispatch) => {
    dispatch(registerCourseStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/course/register', course);
        dispatch(registerCourseSuccess());

        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
        dispatch(registerCourseFailed());
    }
};

export const updateCourse = async (accessToken: string, dispatch: Dispatch, courseData: any, axiosJWT: AxiosJWT) => {
    dispatch(getCoursesByIdStart());
    try {
        const res = await axiosJWT.put(`http://localhost:8000/v1/course/update/${courseData._id}`, courseData, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getCoursesByIdSuccess(res.data));
    } catch (err) {
        dispatch(getCoursesByIdFailed());
    }
};

export const updateCourseAddUser = async (
    accessToken: string,
    dispatch: Dispatch,
    courseId: any,
    userData: any,
    axiosJWT: AxiosJWT,
) => {
    dispatch(getCoursesByIdStart());
    try {
        const res = await axiosJWT.put(`http://localhost:8000/v1/course/updateadduser/${courseId}`, userData, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getCoursesByIdSuccess(res.data));
    } catch (err) {
        dispatch(getCoursesByIdFailed());
    }
};

export const updateLessonCompleted = async (dispatch: Dispatch, courseId: any, userId: any, axiosJWT: AxiosJWT) => {
    dispatch(getCoursesByIdStart());
    try {
        const res = await axiosJWT.put(`http://localhost:8000/v1/course/updatels/${courseId}/${userId}`);
        dispatch(getCoursesByIdSuccess(res.data));
    } catch (err) {
        dispatch(getCoursesByIdFailed());
    }
};

export const registerCourseForUser = async (
    accessToken: string,
    userId: string,
    dispatch: Dispatch,
    courseDetail: any,
    axiosJWT: AxiosJWT,
) => {
    try {
        await axiosJWT.post(`http://localhost:8000/v1/course/${courseDetail?._id}/register`, { userId, courseDetail });
        const user = await axiosJWT.get(`http://localhost:8000/v1/user/getuserbyid/${userId}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(loginCourseForUserSuccess(user.data));
    } catch (err) {
        console.log(err);
        dispatch(updateUserFailed());
    }
};

export const deleteCourse = async (accessToken: string, dispatch: Dispatch, id: string, axiosJWT: AxiosJWT) => {
    dispatch(deleteCoursestart());
    try {
        const res = await axiosJWT.delete(`http://localhost:8000/v1/course/delete/` + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteCoursesSuccess(res.data));
    } catch (err: any) {
        dispatch(deleteCoursesFailed(err.response.data));
    }
};

export const fetchCourseBySlug = async (slug: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/v1/course/detail/${slug}`);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response.data);
            return err.response.data;
        } else {
            console.log(err);
        }
        throw new Error('Error fetching course data');
    }
};

export const getLessonBycourseId = async (
    accessToken: string,
    courseId: string,
    dispatch: Dispatch,
    axiosJWT: AxiosJWT,
) => {
    dispatch(getLessonsByIdStart());
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/lesson/getlessonsbycourseid/` + courseId, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getLessonsByIdSuccess(res.data));
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response.data);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

// API LESSON

export const registerLesson = async (lesson: any, dispatch: Dispatch) => {
    dispatch(registerLessonStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/lesson/register', lesson);
        dispatch(registerLessonSuccess());

        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
        dispatch(registerLessonFailed());
    }
};

export const registerPractice = async (lesson: any, dispatch: Dispatch) => {
    dispatch(registerLessonStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/lesson/registerpractice', lesson);
        dispatch(registerLessonSuccess());

        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
        dispatch(registerLessonFailed());
    }
};

export const getLessonById = async (accessToken: string, lessonId: string, dispatch: Dispatch, axiosJWT: AxiosJWT) => {
    dispatch(getLessonsByIdStart());
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/lesson/getlessonbyid/` + lessonId, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getLessonsByIdSuccess(res.data));
        return res.data;
    } catch (err) {
        dispatch(getLessonsByIdFailed());
        return [];
    }
};

export const updateLesson = async (accessToken: string, dispatch: Dispatch, lessonData: any, axiosJWT: AxiosJWT) => {
    dispatch(getLessonsByIdStart());
    try {
        const res = await axiosJWT.put(`http://localhost:8000/v1/lesson/update/${lessonData._id}`, lessonData, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getLessonsByIdSuccess(res.data));
    } catch (err) {
        dispatch(getLessonsByIdFailed());
    }
};

export const deleteLesson = async (accessToken: string, dispatch: Dispatch, id: string, axiosJWT: AxiosJWT) => {
    dispatch(deleteLessonStart());
    try {
        const res = await axiosJWT.delete(`http://localhost:8000/v1/lesson/delete/` + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteLessonSuccess(res.data));
    } catch (err: any) {
        dispatch(deleteLessonFailed(err.response?.data || 'Error occurred while deleting the lesson'));
    }
};

export const loginGoogle = async (token: any, dispatch: Dispatch, router: any) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/auth/login-google', { token });
        console.log(res);
        dispatch(loginSuccess(res.data));
        router.push('/');
    } catch (err: any) {
        if (err.response) {
            console.log(err.response.data);
            return err.response.data;
        } else {
            console.log(err);
        }
        dispatch(loginFailed());
    }
};

//API NOTIFY
export const createNotify = async (notify: any, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.post('http://localhost:8000/v1/notify/create', notify);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

export const getNotifyForUser = async (userId: any, role: any, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/notify/getnotify/${userId}/${role}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

export const getNotifyForAdmin = async (userId: any, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/notify/getnotifybysenderid/${userId}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

export const getNotifyById = async (notifyId: any, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.get(`http://localhost:8000/v1/notify/getnotifybyid/${notifyId}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

export const updateNotify = async (accessToken: string, dispatch: Dispatch, notifyData: any, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.put(`http://localhost:8000/v1/notify/updatenotify/${notifyData._id}`, notifyData, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getCoursesByIdSuccess(res.data));
    } catch (err) {
        dispatch(getCoursesByIdFailed());
    }
};

export const updateNotificationsToRead = async (userId: any, role: any, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.put(`http://localhost:8000/v1/notify/markallread/${userId}/${role}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

export const updateNotificationToRead = async (userId: any, notifyId: any, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.put(`http://localhost:8000/v1/notify/markoneread/${userId}/${notifyId}`);
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

export const deleteNotify = async (accessToken: string, notifyId: string, axiosJWT: AxiosJWT) => {
    try {
        const res = await axiosJWT.delete(`http://localhost:8000/v1/notify/deletenotify/` + notifyId, {
            headers: { token: `Bearer ${accessToken}` },
        });
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};

export const searchNotify = async (
    accessToken: string,
    axiosJWT: AxiosJWT,
    field: string,
    query: string,
    senderId: string,
) => {
    try {
        const res = await axiosJWT.get(
            `http://localhost:8000/v1/notify/searchnotify?field=${field}&q=${query}&senderId=${senderId}`,
            {
                headers: { token: `Bearer ${accessToken}` },
            },
        );
        return res.data;
    } catch (err: any) {
        if (err.response) {
            console.log(err.response);
            return err.response.data;
        } else {
            console.log(err);
        }
    }
};
