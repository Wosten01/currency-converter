export interface ExchangeRates {
    base_currency: string;
    rates: {
      [key: string]: number;
    };
    date: string;
  }