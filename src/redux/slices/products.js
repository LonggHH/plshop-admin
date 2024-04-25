import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceAxios from "configs/axios";

export const getProducts = createAsyncThunk('product/getAll', async () => {
    const result = await instanceAxios.get('/products');
    return result.data.data;
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        data: null,
    },
    reducers: {
        saveProduct(state, action) {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
});

export const { saveProduct } = productSlice.actions;
export default productSlice.reducer;