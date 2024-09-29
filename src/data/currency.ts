import { fetchCurrencies } from "../api/currencyApi";

type CurrencyMap = {
  [key: string]: string;
};

const currencyNamesResponse: CurrencyMap = await fetchCurrencies();

export const currencyNames = Object.keys(currencyNamesResponse).reduce(
  (acc, key) => {
    acc[key] = currencyNamesResponse[key];
    return acc;
  },
  {} as CurrencyMap
);

export const currencyOptions = Object.entries(currencyNames).map(
  ([value, label]) => ({
    value: value,
    label: `(${value}) ${label}`,
  })
);
