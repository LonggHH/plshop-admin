import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './slices/index';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    // whitelist: ['auth', 'rightbar']
    //blacklist: [] danh sach casc slice bo di
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer
});

export default store;

export const getState = () => store.getState();

export const useReduxState = store.getState;

export const dispatch = store.dispatch;

export const persistor = persistStore(store);