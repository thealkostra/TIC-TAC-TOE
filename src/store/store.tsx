import { configureStore } from "@reduxjs/toolkit"
import allReducer from './allSlice';

export const store = configureStore({
  reducer: {
    all: allReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
