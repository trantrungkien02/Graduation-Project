import { createSlice } from '@reduxjs/toolkit';

const lessonSlice = createSlice({
    name: 'lesson',
    initialState: {
        lesson: {
            allLessons: null,
            allLessonsById: [],
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
        registerLessonStart: (state) => {
            state.register.isFetching = true;
        },
        registerLessonSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerLessonFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        getLessonsStart: (state) => {
            state.lesson.isFetching = true;
        },
        getLessonsSuccess: (state, action) => {
            state.lesson.isFetching = false;
            state.lesson.allLessons = action.payload;
        },
        getLessonsFailed: (state) => {
            state.lesson.isFetching = false;
            state.lesson.error = true;
        },
        getLessonsByIdStart: (state) => {
            state.lesson.isFetching = true;
        },
        getLessonsByIdSuccess: (state, action) => {
            state.lesson.isFetching = false;
            state.lesson.allLessonsById = action.payload;
        },
        getLessonsByIdFailed: (state) => {
            state.lesson.isFetching = false;
            state.lesson.error = true;
        },
        deleteLessonStart: (state) => {
            state.lesson.isFetching = true;
        },
        deleteLessonSuccess: (state, action) => {
            state.lesson.isFetching = false;
            state.lesson.allLessonsById = action.payload;
            state.msg = action.payload;
        },
        deleteLessonFailed: (state, action) => {
            state.lesson.isFetching = false;
            state.lesson.error = true;
            state.msg = action.payload;
        },
        logOutLessonSuccess: (state) => {
            state.lesson.isFetching = false;
            state.lesson.allLessonsById = [];
            state.lesson.error = false;
        },
        logOutLessonFailed: (state) => {
            state.lesson.isFetching = false;
            state.lesson.error = true;
        },
        logOutLessonStart: (state) => {
            state.lesson.isFetching = true;
        },
    },
});

export const {
    registerLessonStart,
    registerLessonSuccess,
    registerLessonFailed,
    getLessonsStart,
    getLessonsSuccess,
    getLessonsFailed,
    getLessonsByIdStart,
    getLessonsByIdSuccess,
    getLessonsByIdFailed,
    deleteLessonStart,
    deleteLessonSuccess,
    deleteLessonFailed,
    logOutLessonStart,
    logOutLessonSuccess,
    logOutLessonFailed,
} = lessonSlice.actions;

export default lessonSlice.reducer;
