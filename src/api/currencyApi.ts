import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const hostname = import.meta.env.VITE_BACKEND_HOSTNAME;

export const currencyApi = createApi({
  reducerPath: "currencyApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${hostname}/api/currency/` }),
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

    getCurrencyByLanguage: builder.query({
      query: (languageCode) => `/currency/by-language?lang=${languageCode}`,
    }),
  }),
});

export const {
  useGetRatesQuery,
  useGetTargetRateQuery,
  useGetCurrencyByLanguageQuery,
} = currencyApi;

export async function fetchBaseCurrency() {
  try {
    const response = await axios.get(`${hostname}/api/location/get-currency`);
    return response.data.currency;
  } catch (error) {
    console.error("Error fetching currency:", error);
    return "USD";
  }
}

export async function fetchCurrencies()   {
  try {
    const response = await axios.get(`${hostname}/api/currency/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching currency:", error);
    return { "RUB": "Российский рубль", "USD": "Доллар США" };
  }
}
