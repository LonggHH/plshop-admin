import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceAxios from "configs/axios";

export const getVariationByProductId = createAsyncThunk('variation/getByProductId', async (id) => {
    const result = await instanceAxios.get(`/variations/product-id/${id}`);
    return result.data.data;
})

const variationSlice = createSlice({
    name: 'variation',
    initialState: {
        data: null,
    },
    reducers: {
        saveVariation(state, action) {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getVariationByProductId.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
});

export const { saveProduct } = variationSlice.actions;
export default variationSlice.reducer;