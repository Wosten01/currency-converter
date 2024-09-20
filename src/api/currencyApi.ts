import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiKey = import.meta.env.VITE_API_KEY

export const currencyApi = createApi({
  reducerPath: 'currencyApi',
  baseQuery: fetchBaseQuery({ baseUrl: `https://v6.exchangerate-api.com/v6/${apiKey}/latest/` }),
  endpoints: (builder) => ({
    getRates: builder.query({
      query: (baseCurrency) => `${baseCurrency}`,
    }),
  }),
});

export const { useGetRatesQuery } = currencyApi;
