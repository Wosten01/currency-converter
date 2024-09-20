import React, { useState } from "react";
import { useGetRatesQuery } from "../../api/currencyApi";
import CurrencySelector, { Option } from "./CurrencySelector";
import { SingleValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setCurrencyFrom, setCurrencyTo, swapCurrencies } from "../../store/currencySlice";

const CurrencyConverter = () => {

  const dispatch = useDispatch();
  const currencyFrom = useSelector((state: RootState) => state.currency.from);
  const currencyTo = useSelector((state: RootState) => state.currency.to);

  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  const {
    data: rates,
    error,
    isLoading,
  } = useGetRatesQuery(currencyFrom?.value);

  const handleCurrencyFromChange = (option: SingleValue<Option>) => {
    dispatch(setCurrencyFrom(option));
    calculateConversion(
      amount,
      currencyFrom!.value,
      currencyTo!.value
    );
  };

  const handleCurrencyToChange = (option: SingleValue<Option>) => {
    setCurrencyTo(option);
    calculateConversion(
      amount,
      currencyFrom!.value,
      currencyTo!.value
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/,/g, ".");

    const validInput = inputValue.replace(/[^0-9.]/g, "");
    const parts = validInput.split(".");
    const formattedIntegerPart = parts[0].replace(/^0+(?=\d)/, "");

    let formattedInput = formattedIntegerPart;

    if (parts.length > 1) {
      const fractionalPart = parts[1].substring(0, 4);
      formattedInput += `.${fractionalPart}`;
    }
    if (formattedInput.replace(".", "").length <= 9) {
      calculateConversion(
        formattedInput,
        currencyFrom!.value,
        currencyTo!.value
      );
      setAmount(formattedInput);
    }
  };

  const calculateConversion = (amount: string, from: string, to: string) => {
    if (amount && from === to) {
      setConvertedAmount(parseFloat(amount));
      return;
    }

    if (!amount || !rates["conversion_rates"][to]) {
      setConvertedAmount(0);
      return;
    }

    const rate = rates["conversion_rates"][to] || 0;
    const result = parseFloat(amount) * rate;
    setConvertedAmount(result);
  };

  const formatCurrency = (value: number): string => {
    const formattedValue = value.toFixed(4);
    const [integerPart, fractionalPart] = formattedValue.split(".");

    if (fractionalPart && fractionalPart !== "0000") {
      const trimmedFractional = fractionalPart.replace(/0+$/, "");
      return `${integerPart}.${trimmedFractional.substring(0, 4)}`;
    }

    return integerPart;
  };

  const handleConvertClick = () => {
    dispatch(swapCurrencies());
    const currentConvertedAmount = convertedAmount;
    calculateConversion(amount, currencyTo!.value, currencyFrom!.value);
    if (currentConvertedAmount !== 0) {
      setAmount(currentConvertedAmount.toString());
    }
  };

  if (isLoading) return <div className="text-black ">Loading...</div>;
  if (error) return <div className="text-black ">Error loading rates</div>;

  return (
    <div className="text-black space-y-10 p-6 max-w-4xl mx-auto">
      <h1 className="text-5xl sm:text-3xl text-center font-bold mb-6">
        Конвертация валют
      </h1>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
        <section className="flex flex-col gap-4 w-full sm:w-5/12">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg">Хочу поменять:</h2>
            <CurrencySelector
              selectedOption={currencyFrom}
              setSelectedOption={handleCurrencyFromChange}
            />
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <input
              value={amount}
              onInput={handleInputChange}
              className="w-full text-4xl font-bold border-none focus:outline-none focus:ring-0"
            />
            <label className="block text-gray-500 mt-2">
              1 {currencyFrom?.value} ={" "}
              {currencyTo === currencyFrom
                ? 1
                : formatCurrency(
                    rates["conversion_rates"][currencyTo!.value]
                  )}{" "}
              {currencyTo?.value}
            </label>
          </div>
        </section>

        <section className="self-center sm:mt-24">
          <button
            onClick={handleConvertClick}
            className="hover:opacity-50 transition duration-300 font-bold py-3 px-6 rounded-full"
          >
            <img
              src={"../../../src/assets/transfer.svg"}
              alt="Transfer"
              className="w-8 h-8"
            />
          </button>
        </section>

        <section className="flex flex-col gap-4 w-full sm:w-5/12">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg">Получу:</h2>
            <CurrencySelector
              selectedOption={currencyTo}
              setSelectedOption={handleCurrencyToChange}
            />
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <input
              value={
                !isLoading
                  ? formatCurrency(convertedAmount) || ""
                  : error
                  ? String(error)
                  : ""
              }
              readOnly
              className="w-full text-4xl font-bold border-none focus:outline-none focus:ring-0"
            />
            <label className="block text-gray-500 mt-2">
              1 {currencyTo?.value} ={" "}
              {currencyTo === currencyFrom
                ? 1
                : formatCurrency(
                    1 / rates["conversion_rates"][currencyTo!.value]
                  )}{" "}
              {currencyFrom?.value}
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CurrencyConverter;
