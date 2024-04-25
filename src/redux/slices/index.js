import { combineReducers } from '@reduxjs/toolkit'
import authSlice from './auth.js'
import categorySlice from './category.js'
import brandSlice from './brand.js'
import productSlice from './products.js'
import variationSlice from './variation.js'
import orderSlice from './order.js'
import accountSlice from './account.js'

export const rootReducer = combineReducers({
    auth: authSlice,
    category: categorySlice,
    brand: brandSlice,
    product: productSlice,
    variation: variationSlice,
    order: orderSlice,
    account: accountSlice,
})