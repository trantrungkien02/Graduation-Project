import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    isHasCompany: true,
};

export const isHasCompany = createSlice({
    name: 'hascompany',
    initialState,
    reducers: {
        HandleCreateCompany: (state) => {
            state.isHasCompany = true;
        },
        HandleDeleteCompany: (state) => {
            state.isHasCompany = false;
        },
    },
});

export const { HandleCreateCompany, HandleDeleteCompany } = isHasCompany.actions;

export default isHasCompany.reducer;
