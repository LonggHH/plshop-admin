import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceAxios from "configs/axios";

export const getCategories = createAsyncThunk('category/getAll', async () => {
    const result = await instanceAxios.get('/categories');
    return result.data.data;
})

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        data: null,
    },
    reducers: {
        saveCategory(state, action) {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
});

export const { saveCategory } = categorySlice.actions;
export default categorySlice.reducer;