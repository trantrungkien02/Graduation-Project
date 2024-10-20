import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    isShowModal: false,
};

export const modalShowAddCompany = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        HandleShowAddCompany: (state) => {
            state.isShowModal = true;
        },
        HandleHideAddCompany: (state) => {
            state.isShowModal = false;
        },
    },
});

export const { HandleShowAddCompany, HandleHideAddCompany } = modalShowAddCompany.actions;

export default modalShowAddCompany.reducer;
