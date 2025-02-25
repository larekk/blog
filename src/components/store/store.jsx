import { configureStore } from '@reduxjs/toolkit'

import articlesReducer from './articlesSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    user: userReducer,
  },
})
