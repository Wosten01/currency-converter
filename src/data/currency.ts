export type Currency = "RUB" | "USD" | "EUR" | "GBD";

export type ExchangeRates = {
  [key in Currency]: { [key in Currency]?: number };
};

export const exchangeRates: ExchangeRates = {
  RUB: { USD: 0.01, EUR: 0.0098, GBD: 0.008 },
  USD: { RUB: 100, EUR: 0.93, GBD: 0.83 },
  EUR: { RUB: 102, USD: 1.07, GBD: 0.89 },
  GBD: { RUB: 120, USD: 1.2, EUR: 1.13 },
};
