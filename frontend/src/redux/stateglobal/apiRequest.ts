import axios from 'axios';
import { Dispatch } from 'redux';
import {
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
import { useRouter } from 'next/router';
import {
    getCoursesFailed,
    getCoursesStart,
    getCoursesSuccess,
    registerCourseFailed,
    registerCourseStart,
    registerCourseSuccess,
} from './courseSlice';

// Define the user type
interface User {
    username: string;
    password: string;
}

interface AxiosJWT {
    get: Function;
    delete: Function;
    post: Function;
}

export const loginUser = async (user: any, dispatch: Dispatch, router: any) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/auth/login', user);
        console.log(res); // Log khi trạng thái 200
        dispatch(loginSuccess(res.data));
        router.push('/');
    } catch (err: any) {
        if (err.response) {
            // Log phản hồi ngay cả khi nó là lỗi
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

        return res.data; // Trả về dữ liệu từ phản hồi thành công (status 2xx)
    } catch (err: any) {
        if (err.response) {
            // Log phản hồi nếu có lỗi (status không phải 2xx)
            console.log(err.response);
            return err.response.data; // Trả về dữ liệu lỗi nếu cần
        } else {
            console.log(err); // Log lỗi khác (lỗi mạng, không phản hồi từ server, ...)
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
    try {
        await axiosJWT.post('http://localhost:8000/v1/auth/logout', id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        router.push('/login');
    } catch (err) {
        dispatch(logOutFailed());
    }
};

export const getAllCourses = async (dispatch: Dispatch, axiosJWT: AxiosJWT) => {
    dispatch(getCoursesStart());
    try {
        const res = await axiosJWT.get('http://localhost:8000/v1/course/getallcourses', {});
        dispatch(getCoursesSuccess(res.data));
    } catch (err) {
        dispatch(getCoursesFailed());
    }
};
export const registerCourse = async (course: any, dispatch: Dispatch) => {
    dispatch(registerCourseStart());
    try {
        const res = await axios.post('http://localhost:8000/v1/course/register', course);
        dispatch(registerCourseSuccess());

        return res.data; // Trả về dữ liệu từ phản hồi thành công (status 2xx)
    } catch (err: any) {
        if (err.response) {
            // Log phản hồi nếu có lỗi (status không phải 2xx)
            console.log(err.response);
            return err.response.data; // Trả về dữ liệu lỗi nếu cần
        } else {
            console.log(err); // Log lỗi khác (lỗi mạng, không phản hồi từ server, ...)
        }
        dispatch(registerCourseFailed());
    }
};

export const fetchCourseBySlug = async (slug: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/v1/course/${slug}`);
        return response.data; // Trả về dữ liệu khóa học nếu thành công
    } catch (err: any) {
        if (err.response) {
            // Log phản hồi lỗi nếu có (status không phải 2xx)
            console.log(err.response.data);
            return err.response.data; // Trả về dữ liệu lỗi nếu cần
        } else {
            console.log(err); // Log lỗi khác (lỗi mạng, không phản hồi từ server, ...)
        }
        throw new Error('Error fetching course data');
    }
};

export const updateUser = async (user: any, dispatch: Dispatch) => {
    dispatch(updateUserStart()); // Bắt đầu dispatch action update
    try {
        const res = await axios.put('http://localhost:8000/v1/user/update-user', user); // Gửi yêu cầu PUT tới API
        dispatch(updateUserSuccess(res.data)); // Dispatch khi thành công

        return res.data; // Trả về dữ liệu từ phản hồi thành công (status 2xx)
    } catch (err: any) {
        if (err.response) {
            // Log phản hồi lỗi nếu có (status không phải 2xx)
            console.log(err.response.data);
            return err.response.data; // Trả về dữ liệu lỗi nếu cần
        } else {
            console.log(err); // Log lỗi khác (lỗi mạng, không phản hồi từ server, ...)
        }
        dispatch(updateUserFailed()); // Dispatch khi thất bại
    }
};
