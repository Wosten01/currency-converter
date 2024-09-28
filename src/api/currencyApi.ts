import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const apiKey = import.meta.env.VITE_API_KEY

// `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`

export const currencyApi = createApi({
  reducerPath: "currencyApi",
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:3000/api/currency/` }),
  endpoints: (builder) => ({
    getRates: builder.query({
      query: (baseCurrency) => `${baseCurrency}`,
    }),

    getTargetRate: builder.query({
      query: ({ from, to }) => {
        if (!from || !to) {
          throw new Error("Both `from` and `to` currencies are required");
        }
        return `${from}/to/${to}`;
      },
    }),
  }),
});

export const { useGetRatesQuery, useGetTargetRateQuery } = currencyApi;
