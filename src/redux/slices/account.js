import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceAxios from "configs/axios";

export const getAccounts = createAsyncThunk('account/getAll', async () => {
    const result = await instanceAxios.get('/accounts');
    return result.data.data;
})

const accountSlice = createSlice({
    name: 'account',
    initialState: {
        data: null,
    },
    reducers: {
        saveAccount(state, action) {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAccounts.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
});

export const { saveAccount } = accountSlice.actions;
export default accountSlice.reducer;