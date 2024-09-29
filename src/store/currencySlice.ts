import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {currencyOptions } from "../data/currency";
import { Option } from "../components/currency-converter/CurrencySelector";
import { SingleValue } from "react-select";
import { fetchCurrency } from "../api/currencyApi";

interface CurrencyState {
  from: SingleValue<Option>;
  to: SingleValue<Option>;
}
 const baseCurrency = await fetchCurrency()

const initialState: CurrencyState = {
  from: currencyOptions[
    currencyOptions.findIndex(({ value }) => value === baseCurrency)
  ],
  to: currencyOptions[Math.floor(Math.random() * currencyOptions.length)],
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrencyFrom(state, action: PayloadAction<SingleValue<Option>>) {
      state.from = action.payload;
    },
    setCurrencyTo(state, action: PayloadAction<SingleValue<Option>>) {
      state.to = action.payload;
    },
    swapCurrencies(state) {
      const temp = state.from;
      state.from = state.to;
      state.to = temp;
    },
  },
});

export const { setCurrencyFrom, setCurrencyTo, swapCurrencies } =
  currencySlice.actions;

export default currencySlice.reducer;
