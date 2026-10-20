import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice.js'

export default configureStore({
  reducer: {
    search: searchReducer,
  },
})
