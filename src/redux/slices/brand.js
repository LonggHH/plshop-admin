import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceAxios from "configs/axios";

export const getBrands = createAsyncThunk('brand/getAll', async () => {
    const result = await instanceAxios.get('/brands');
    return result.data.data;
})

const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        data: null,
    },
    reducers: {
        saveBrand(state, action) {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getBrands.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
});

export const { saveBrand } = brandSlice.actions;
export default brandSlice.reducer;