import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceAxios from "configs/axios";

export const getOrders = createAsyncThunk('order/getAll', async () => {
    const result = await instanceAxios.get('/orders');
    return result.data.data;
})

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        data: null,
    },
    reducers: {
        saveOrder(state, action) {
            state.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrders.fulfilled, (state, action) => {
            state.data = action.payload;
        })
    }
});

export const { saveOrder } = orderSlice.actions;
export default orderSlice.reducer;