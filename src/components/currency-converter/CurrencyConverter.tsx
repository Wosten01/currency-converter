import React, { useEffect, useState } from "react";
import { useGetRatesQuery } from "../../api/currencyApi";
import CurrencySelector, { Option } from "./CurrencySelector";
import { SingleValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "../../store";
import {
  setCurrencyFrom,
  setCurrencyTo,
  swapCurrencies,
} from "../../store/currencySlice";
// import { useNavigate } from "react-router-dom";
import Decimal from "decimal.js";
import { formatCurrency } from "../../utils";

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

  // const navigate = useNavigate(); 

  // const goToListPage = () => {
  //   navigate("/list");
  // };

  const handleCurrencyFromChange = (option: SingleValue<Option>) => {
    dispatch(setCurrencyFrom(option));
    calculateConversion(
      amount,
      store.getState().currency.from!.value,
      store.getState().currency.to!.value,
      rates
    );
  };

  const handleCurrencyToChange = (option: SingleValue<Option>) => {
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
    rates: any
  ) => {
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

  // ce2e57735c2c426aec75cabcdd0db480

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refetch, refresh]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-black text-2xl font-semibold">Подождите идет загрузка...</div>
      </div>
    );
  }



  if (error) {
    console.error(error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-black text-2xl font-semibold">
          Ошибка при получении данных
        </div>
      </div>
    );
  }

  return (
    <div className="text-black space-y-10 p-6 max-w-4xl mx-auto flex flex-col items-center ">
      <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 ">
          <section className="flex flex-col gap-4 w-full sm:w-5/12">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg ">Хочу поменять:</h2>
              <CurrencySelector
                selectedOption={currencyFrom}
                setSelectedOption={handleCurrencyFromChange}
              />
            </div>
            <div className="border border-gray-300 bg-gray-100 p-4 rounded-lg">
              <input
                value={amount}
                onInput={handleInputChange}
                className=" bg-gray-100 w-full text-4xl font-bold border-none focus:outline-none focus:ring-0"
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
            <div className="border bg-gray-100 border-gray-300 p-4 rounded-lg">
              <input
                value={
                  !isLoading
                    ? convertedAmount || ""
                    : error
                    ? String(error)
                    : ""
                }
                readOnly
                className="bg-gray-100 w-full text-4xl font-bold border-none focus:outline-none focus:ring-0"
              />
              <label className="block text-gray-500 mt-2">
                1 {currencyTo?.value} ={" "}
                {
                  currencyTo === currencyFrom
                    ? 1
                    : formatCurrency(
                        new Decimal(1).div(
                          rates["conversion_rates"][currencyTo!.value]
                        )
                      )
                }{" "}
                {currencyFrom?.value}
              </label>
            </div>
          </section>
        </div>
      </div>
      {/* <button
        onClick={goToListPage}
        className="mt-20 px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-[#2584ff] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Перейти к списку курсов валют
      </button> */}
    </div>
  );
};

export default CurrencyConverter;
