import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    isShowSidebar: true,
};

export const modalShowSidebar = createSlice({
    name: 'Sidebar',
    initialState,
    reducers: {
        HandleOpenSidebar: (state) => {
            state.isShowSidebar = true;
        },
        HandleCloseSidebar: (state) => {
            state.isShowSidebar = false;
        },
    },
});

export const { HandleOpenSidebar, HandleCloseSidebar } = modalShowSidebar.actions;

export default modalShowSidebar.reducer;
