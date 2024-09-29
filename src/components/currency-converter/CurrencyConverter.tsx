import React, { useEffect, useState } from "react";
import { useGetRatesQuery, useGetTargetRateQuery } from "../../api/currencyApi";
import CurrencySelector, { Option } from "./CurrencySelector";
import { SingleValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../../store";
import {
  setCurrencyFrom,
  setCurrencyTo,
  swapCurrencies,
} from "../../store/currencySlice";
import { formatCurrency } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { ExchangeRates } from "../../data/dto";

const CurrencyConverter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currencyFrom = useSelector((state: RootState) => state.currency.from);
  const currencyTo = useSelector((state: RootState) => state.currency.to);

  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  const [refresh, setRefresh] = useState<boolean>(false);

  const {
    data: rates,
    error,
    isLoading,
    refetch,
  } = useGetRatesQuery(store.getState().currency.from?.value);

  const {
    data: dataTargetRate,
    error: errorTargetRate,
    isLoading: isLoadingTargetRate,
    refetch: refetchTargetRate,
  } = useGetTargetRateQuery({
    from: store.getState().currency.to?.value,
    to: store.getState().currency.from?.value,
  });

  const handleCurrencyFromChange = async (option: SingleValue<Option>) => {
    dispatch(setCurrencyFrom(option));
    await refetchTargetRate();
    const rates = (await refetch()).data;
    calculateConversion(
      amount,
      store.getState().currency.from!.value,
      store.getState().currency.to!.value,
      rates
    );
  };

  const handleCurrencyToChange = (option: SingleValue<Option>) => {
    refetchTargetRate();
    dispatch(setCurrencyTo(option));
    calculateConversion(
      amount,
      store.getState().currency.from!.value,
      store.getState().currency.to!.value,
      rates
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
      const fractionalPart = parts[1].substring(0, 10);
      formattedInput += `.${fractionalPart}`;
    }
    if (formattedInput.replace(".", "").length <= 9) {
      calculateConversion(
        formattedInput,
        currencyFrom!.value,
        currencyTo!.value,
        rates
      );
      setAmount(formattedInput);
    }
  };

  const calculateConversion = (
    amount: string,
    from: string,
    to: string,
    rates: ExchangeRates
  ) => {
    if (amount && from === to) {
      setConvertedAmount(parseFloat(amount));
      return;
    }

    if (!amount || !rates.rates[to]) {
      setConvertedAmount(0);
      return;
    }

    const rate = rates.rates[to] || 0;
    const result = parseFloat(amount) * rate;
    setConvertedAmount(Number(formatCurrency(result)));
  };

  const handleConvertClick = async () => {
    dispatch(swapCurrencies());
    setTimeout(async () => {
      const rates = (await refetch()).data;
      calculateConversion(
        amount,
        store.getState().currency.from!.value,
        store.getState().currency.to!.value,
        rates
      );
    }, 0);
  };

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refetch, refresh]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-black text-3xl font-semibold">
          Подождите, идет загрузка...
        </div>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-black text-3xl font-semibold">
          Ошибка при получении данных
        </div>
      </div>
    );
  }

  return (
    <div className="text-black space-y-12 p-6 max-w-6xl mx-auto flex flex-col items-center">
      <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12">
          <section className="flex flex-col gap-6 w-full sm:w-5/12">
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-400 font-bold text-base sm:text-xl">
                Хочу поменять:
              </h2>
              <CurrencySelector
                selectedOption={currencyFrom}
                setSelectedOption={handleCurrencyFromChange}
              />
            </div>
            <div className="border border-gray-300 bg-gray-100 p-6 rounded-lg">
              <input
                value={amount}
                onInput={handleInputChange}
                className="bg-gray-100 text-[#156ada] w-full text-5xl font-bold border-none focus:outline-none focus:ring-0"
              />
              <label className="block text-gray-500 mt-2 text-xl">
                1 {currencyFrom?.value} ={" "}
                {currencyTo === currencyFrom
                  ? 1
                  : formatCurrency(rates.rates[currencyTo!.value])}{" "}
                {currencyTo?.value}
              </label>
            </div>
          </section>

          <section className="self-center sm:mt-24">
            <button
              onClick={handleConvertClick}
              className="hover:opacity-50  transition duration-300 font-bold py-5 px-10 rounded-full"
            >
              <FontAwesomeIcon
                icon={faExchangeAlt}
                className="text-4xl text-[#2584ff]"
              />
            </button>
          </section>

          <section className="flex flex-col gap-6 w-full sm:w-5/12">
            <div className="flex flex-col gap-2">
              <h2 className="text-gray-400 font-bold text-base sm:text-xl">
                Получу:
              </h2>
              <CurrencySelector
                selectedOption={currencyTo}
                setSelectedOption={handleCurrencyToChange}
              />
            </div>
            <div className="border bg-gray-100 border-gray-300 p-6 rounded-lg">
              <input
                value={
                  !isLoading
                    ? convertedAmount || ""
                    : error
                    ? String(error)
                    : ""
                }
                readOnly
                className="bg-gray-100 text-[#156ada] w-full text-5xl font-bold border-none focus:outline-none focus:ring-0"
              />
              <label className="block text-gray-500 mt-2 text-xl">
                1 {currencyTo?.value} ={" "}
                {currencyTo === currencyFrom
                  ? 1
                  : isLoadingTargetRate || errorTargetRate
                  ? ""
                  : formatCurrency(dataTargetRate.amount)}{" "}
                {currencyFrom?.value}
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
