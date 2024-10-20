import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
    name: 'course',
    initialState: {
        courses: {
            allCourses: null,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
        },
        msg: '',
    },
    reducers: {
        registerCourseStart: (state) => {
            state.register.isFetching = true;
        },
        registerCourseSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerCourseFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        getCoursesStart: (state) => {
            state.courses.isFetching = true;
        },
        getCoursesSuccess: (state, action) => {
            state.courses.isFetching = false;
            state.courses.allCourses = action.payload;
        },
        getCoursesFailed: (state) => {
            state.courses.isFetching = false;
            state.courses.error = true;
        },
        deleteCoursestart: (state) => {
            state.courses.isFetching = true;
        },
        deleteCoursesSuccess: (state, action) => {
            state.courses.isFetching = false;
            state.msg = action.payload;
        },
        deleteCoursesFailed: (state, action) => {
            state.courses.isFetching = false;
            state.courses.error = true;
            state.msg = action.payload;
        },
    },
});

export const {
    registerCourseStart,
    registerCourseSuccess,
    registerCourseFailed,
    getCoursesStart,
    getCoursesSuccess,
    getCoursesFailed,
    deleteCoursestart,
    deleteCoursesSuccess,
    deleteCoursesFailed,
} = courseSlice.actions;

export default courseSlice.reducer;
