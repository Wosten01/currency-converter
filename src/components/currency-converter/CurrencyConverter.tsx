import React, { useEffect, useState } from "react";
import { useGetRatesQuery, useGetTargetRateQuery } from "../../api/currencyApi";
import { Option } from "./CurrencySelector";
import { SingleValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../../store";
import {
  setCurrencyFrom,
  setCurrencyTo,
  swapCurrencies,
} from "../../store/currencySlice";
import { formatCurrency, formatInputValue } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { ExchangeRates } from "../../data/dto";
import CurrencyInputSection from "./CurrencyInput";

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
    const formattedInput = formatInputValue(e.target.value);

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

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await refetch();
      await refetchTargetRate();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refetch, refetchTargetRate]);

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
    <div className="text-black space-y-2 sm:space-y-12 p-6 max-w-6xl mx-auto flex flex-col items-center">
      <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12">
          <CurrencyInputSection
            title="Хочу поменять:"
            selectedCurrency={currencyFrom}
            onCurrencyChange={handleCurrencyFromChange}
            amount={amount}
            onInputChange={handleInputChange}
            conversionRateLabel={`1 ${currencyFrom?.value} = ${
              currencyTo === currencyFrom
                ? 1
                : formatCurrency(rates.rates[currencyTo!.value])
            } ${currencyTo?.value}`}
          />

          <section className="self-center sm:mt-24">
            <button
              onClick={handleConvertClick}
              className="hover:opacity-50  transition duration-300 font-bold sm:py-5 px-10 rounded-full"
            >
              <FontAwesomeIcon
                icon={faExchangeAlt}
                className="text-4xl text-[#2584ff]"
              />
            </button>
          </section>

          <CurrencyInputSection
            title="Получу:"
            selectedCurrency={currencyTo}
            onCurrencyChange={handleCurrencyToChange}
            amount={
              !isLoading ? convertedAmount || "" : error ? String(error) : ""
            }
            readOnly
            conversionRateLabel={`1 ${currencyTo?.value} = ${
              currencyTo === currencyFrom
                ? 1
                : isLoadingTargetRate || errorTargetRate
                ? ""
                : formatCurrency(dataTargetRate.amount)
            } ${currencyFrom?.value}`}
          />
        </div>

        <section className=" pb-5 pt-5 text-end">
          <h2 className=" text-gray-400 font-bold text-base sm:text-xl ">
            Данные на момент: {new Date(rates.date).toLocaleString()}
          </h2>
        </section>
      </div>
    </div>
  );
};

export default CurrencyConverter;
