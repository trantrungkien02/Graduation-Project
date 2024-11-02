import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        loginCourseForUserSuccess: (state, action) => {
            state.login.isFetching = false;
            if (state.login.currentUser) {
                const { accessToken } = state.login.currentUser; // Lưu accessToken hiện tại
                const { accessToken: newAccessToken, ...rest } = action.payload; // Tách accessToken mới ra khỏi action.payload

                // Gán lại với các thuộc tính khác từ payload và giữ accessToken hiện tại
                state.login.currentUser = { ...rest, accessToken };
            } else {
                // Nếu currentUser là null, có thể bạn muốn xử lý trường hợp này
                // Ví dụ: Gán currentUser bằng payload mới nếu không có currentUser hiện tại
                state.login.currentUser = action.payload;
            }

            state.login.error = false;
        },
        updateUserStart: (state) => {
            state.login.isFetching = true;
        },
        updateUserSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        updateUserFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
    },
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    loginCourseForUserSuccess,
    updateUserStart,
    updateUserSuccess,
    updateUserFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
} = authSlice.actions;

export default authSlice.reducer;
