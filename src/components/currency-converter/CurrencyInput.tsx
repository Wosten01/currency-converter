import React from "react";

interface CurrencyInputProps {
  amount: string;
  handleInputChange: Function;
  currencyFrom: { value: string } | null;
  currencyTo: { value: string } | null;
  rates: any;
  readonly: boolean;
}

const formatCurrency = (value: number) => {
  return value.toFixed(2); // или другая логика форматирования
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amount,
  handleInputChange,
  currencyFrom,
  currencyTo,
  rates,
  readonly = false
}) => {
  return (
    <div className="border border-gray-300 bg-gray-100 p-4 rounded-lg">
      <input
        readOnly={readonly}
        value={amount}
        onInput={handleInputChange}
        className="bg-gray-100 w-full text-4xl font-bold border-none focus:outline-none focus:ring-0"
      />
      <label className="block text-gray-500 mt-2">
        1 {currencyFrom?.value} ={" "}
        {currencyTo === currencyFrom
          ? 1
          : formatCurrency(rates["conversion_rates"][currencyTo!.value])}{" "}
        {currencyTo?.value}
      </label>
    </div>
  );
};

export default CurrencyInput;
