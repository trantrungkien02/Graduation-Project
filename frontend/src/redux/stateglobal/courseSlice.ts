import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
    name: 'course',
    initialState: {
        courses: {
            allCourses: null,
            allCoursesById: [],
            courseOrder: null,
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
        getCoursesByIdStart: (state) => {
            state.courses.isFetching = true;
        },
        getCoursesByIdSuccess: (state, action) => {
            state.courses.isFetching = false;
            state.courses.allCoursesById = action.payload;
        },
        getCoursesByIdFailed: (state) => {
            state.courses.isFetching = false;
            state.courses.error = true;
        },
        getCoursesOrderSuccess: (state, action) => {
            state.courses.isFetching = false;
            state.courses.courseOrder = action.payload;
        },
        deleteCoursestart: (state) => {
            state.courses.isFetching = true;
        },
        deleteCoursesSuccess: (state, action) => {
            state.courses.isFetching = false;
            state.courses.allCoursesById = action.payload;
            state.msg = action.payload;
        },
        deleteCoursesFailed: (state, action) => {
            state.courses.isFetching = false;
            state.courses.error = true;
            state.msg = action.payload;
        },
        logOutCoursesSuccess: (state) => {
            state.courses.isFetching = false;
            state.courses.allCoursesById = [];
            state.courses.error = false;
        },
        logOutCoursesFailed: (state) => {
            state.courses.isFetching = false;
            state.courses.error = true;
        },
        logOutCoursesStart: (state) => {
            state.courses.isFetching = true;
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
    getCoursesByIdStart,
    getCoursesByIdSuccess,
    getCoursesByIdFailed,
    getCoursesOrderSuccess,
    deleteCoursestart,
    deleteCoursesSuccess,
    deleteCoursesFailed,
    logOutCoursesStart,
    logOutCoursesSuccess,
    logOutCoursesFailed,
} = courseSlice.actions;

export default courseSlice.reducer;
