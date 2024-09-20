import { configureStore } from '@reduxjs/toolkit';
import { currencyApi } from '../api/currencyApi';

const store = configureStore({
  reducer: {
    [currencyApi.reducerPath]: currencyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(currencyApi.middleware),
});

export default store
