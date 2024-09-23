import { useState } from "react";
import { SingleValue } from "react-select";
import CurrencySelector, {
  Option,
} from "../currency-converter/CurrencySelector";
import { currencyNames } from "../../data/currency";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGetRatesQuery } from "../../api/currencyApi";
import { setCurrencyFrom, setCurrencyTo } from "../../store/currencySlice";
import { useNavigate } from "react-router-dom";

const CurrencyRatesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.from
  );

  const {
    data: rates,
    error,
    isLoading,
  } = useGetRatesQuery(selectedCurrency?.value);

  const [searchTerm, setSearchTerm] = useState("");

  const handleCurrencyChange = (option: SingleValue<Option>) => {
    dispatch(setCurrencyFrom(option));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCurrencies = Object.entries(currencyNames).filter(
    ([value, label]) =>
      value.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      label.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleCurrencyButton = (option: Option) => () => {
    dispatch(setCurrencyTo(option));
    navigate("/");
  };

  return (
    <div className="text-black space-y-6 p-6 max-w-4xl mx-auto">
      <CurrencySelector
        selectedOption={selectedCurrency}
        setSelectedOption={handleCurrencyChange}
      />

      <input
        type="search"
        placeholder="Введите валюту..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 p-2 w-full rounded-md mt-4"
      />

      <div>
        <div className="text-gray-400">
          Из списка ниже выберете валюту, в которую хотите конвертировать:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredCurrencies.length > 0 ? (
            filteredCurrencies.map(([value, label]) => (
              <button onClick={handleCurrencyButton({ value, label })}>
                <div
                  key={value}
                  className="border p-4 rounded-lg shadow-md text-center flex flex-col justify-center h-32"
                >
                  <h2 className="text-3xl font-bold">
                    {!error && !isLoading
                      ? rates?.conversion_rates[value] || 0
                      : 0}
                  </h2>
                  <h3 className="text-lg">{value}</h3>
                  <p
                    className={`font-extralight ${
                      label.length > 20 ? "text-sm" : ""
                    }`}
                  >
                    {label}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-center col-span-full">Валюта не найдена</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyRatesList;
