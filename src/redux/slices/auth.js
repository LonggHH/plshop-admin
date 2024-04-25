import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: null,
        form: {
            isOpen: false
        }
    },
    reducers: {
        saveAdmin(state, action) {
            if (!action.payload) {
                state.data = action.payload
            } else {
                state.data = { ...state.data, ...action.payload };
            }
        },
        saveToken(state, action) {
            state.data.accessToken = action.payload.accessToken;
            state.data.refreshToken = action.payload.refreshToken;
        },
        setFormEditProfile(state, action) {
            state.form = action.payload
        }
    },
});

export const { saveAdmin, saveToken, setFormEditProfile } = authSlice.actions;
export default authSlice.reducer;