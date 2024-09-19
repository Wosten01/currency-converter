// export default CurrencyConverter;
import React, { useState } from "react";
import { Currency, exchangeRates } from "../../data/currency";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("");
  const [currencyFrom, setCurrencyFrom] = useState<Currency>("RUB");
  const [currencyTo, setCurrencyTo] = useState<Currency>("USD");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

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
      calculateConversion(formattedInput, currencyFrom, currencyTo);
      setAmount(formattedInput);
    }
  };

  const handleCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: "from" | "to"
  ) => {
    const newCurrency = e.target.value as Currency;
    if (type === "from") {
      setCurrencyFrom(newCurrency);
      calculateConversion(amount, newCurrency, currencyTo);
    } else {
      setCurrencyTo(newCurrency);
      calculateConversion(amount, currencyFrom, newCurrency);
    }
  };

  const calculateConversion = (
    amount: string,
    from: Currency,
    to: Currency
  ) => {
    if (amount && from === to) {
      setConvertedAmount(parseFloat(amount));
      return;
    }
    if (!amount || !exchangeRates[from] || !exchangeRates[from][to]) {
      setConvertedAmount(0);
      return;
    }

    const rate = exchangeRates[from][to] || 0;
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
    if (amount) {
      const tmp = currencyFrom;
      setCurrencyFrom(currencyTo)
      setCurrencyTo(tmp)
      calculateConversion(amount, currencyTo, tmp);
    }
  };

  return (
    <div className="text-black space-y-10 p-6 max-w-4xl mx-auto">
      <h1 className="text-5xl sm:text-3xl text-center font-bold mb-6">
        Конвертация валют
      </h1>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
        {/* Блок для ввода данных */}
        <section className="flex flex-col gap-4 w-full sm:w-5/12">
          <h2 className="text-xl sm:text-2xl">Хочу поменять:</h2>
          <div className="relative inline-block">
            <select
              id="currency-from"
              value={currencyFrom}
              onChange={(e) => handleCurrencyChange(e, "from")}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="RUB">RUB</option>
              <option value="USD">USD</option>
              <option value="GBD">GBD</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.5 7l4.5 4.5L14.5 7h-9z" />
              </svg>
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <input
              value={amount}
              onInput={handleInputChange}
              className="w-full text-4xl font-bold border-none focus:outline-none focus:ring-0"
            />
            <label className="block text-gray-500 mt-2">
              1 {currencyFrom} ={" "}
              {currencyTo === currencyFrom
                ? 1
                : exchangeRates[currencyFrom][currencyTo]}{" "}
              {currencyTo}
            </label>
          </div>
        </section>

        {/* Кнопка обмена */}
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

        {/* Блок для вывода результата */}
        <section className="flex flex-col gap-4 w-full sm:w-5/12">
          <h2 className="text-xl sm:text-2xl">Получу:</h2>
          <div className="relative inline-block">
            <select
              id="currency-to"
              value={currencyTo}
              onChange={(e) => handleCurrencyChange(e, "to")}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="RUB">RUB</option>
              <option value="GBD">GBD</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.5 7l4.5 4.5L14.5 7h-9z" />
              </svg>
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <input
              value={formatCurrency(convertedAmount) || ""}
              readOnly
              className="w-full text-4xl font-bold border-none focus:outline-none focus:ring-0"
            />
            <label className="block text-gray-500 mt-2">
              1 {currencyTo} ={" "}
              {currencyTo === currencyFrom
                ? 1
                : exchangeRates[currencyTo][currencyFrom]}{" "}
              {currencyFrom}
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CurrencyConverter;
