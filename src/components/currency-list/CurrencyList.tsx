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
import { formatCurrency } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faThList } from "@fortawesome/free-solid-svg-icons";

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

  const [amount, setAmount] = useState<string>("");

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
      setAmount(formattedInput);
    }
  };

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
  const [viewMode, setViewMode] = useState(3);

  const handleViewModeChange = (mode: number) => {
    setViewMode(mode);
  };

  const gridClasses =
    viewMode === 1
      ? "grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <main className="text-black space-y-4 p-6 max-w-6xl mx-auto">
      <section>
        <h2 className="text-gray-400 font-bold text-base sm:text-xl">
          Базовая валюта:
        </h2>
        <CurrencySelector
          selectedOption={selectedCurrency}
          setSelectedOption={handleCurrencyChange}
        />
      </section>

      <section>
        <h2 className="text-gray-400 font-bold text-base sm:text-xl">
          Сумма для конвертации:
        </h2>
        <input
          value={amount}
          onInput={handleInputChange}
          className="border text-[#156ada] border-gray-300 p-1 w-full rounded-md text-3xl font-bold text-center"
        />
      </section>

      <section>
        <h2 className="text-gray-400 font-bold text-base sm:text-xl">
          Искомая валюта:
        </h2>
        <input
          type="search"
          placeholder="Введите искомую валюту..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 w-full rounded-md  text-xl"
        />
      </section>

      <section className="">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-400">
            Из списка ниже выберете валюту, в которую хотите конвертировать и
            нажмите на неё:
          </h2>
          <div className="space-x-4 hidden sm:flex">
            <button
              onClick={() => handleViewModeChange(1)}
              className="p-2 rounded-md hover:bg-gray-200 transition duration-200"
            >
              <FontAwesomeIcon
                icon={faThList}
                className={`text-gray-600 ${
                  viewMode === 1 ? "text-blue-500" : ""
                }`}
              />
            </button>
            <button
              onClick={() => handleViewModeChange(3)}
              className="p-2 rounded-md hover:bg-gray-200 transition duration-200"
            >
              <FontAwesomeIcon
                icon={faTh}
                className={`text-gray-600 ${
                  viewMode === 3 ? "text-blue-500" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className={`grid ${gridClasses} gap-4 mt-2`}>
          {filteredCurrencies.length > 0 ? (
            filteredCurrencies
              .filter(([value]) => value != selectedCurrency?.value)
              .map(([value, label]) => (
                <button
                  key={value}
                  onClick={handleCurrencyButton({ value, label })}
                >
                  <div
                    className=" border p-4 rounded-lg shadow-md text-center flex 
                                flex-col justify-center h-32 
                                hover:bg-[#2584ff] hover:text-white 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 
                                transition duration-300 group"
                  >
                    <h2 className="text-3xl font-bold text-[#156ada] group-hover:text-white">
                      {!error && !isLoading
                        ? formatCurrency(
                            rates?.rates[value] *
                              (amount ? parseFloat(amount) : 1)
                          ) || 0
                        : 0}
                    </h2>
                    <h3 className="text-xl text-[#156ada] group-hover:text-white">{value}</h3>
                    <p
                      className={`  ${
                        label.length > 20
                          ? label.length > 25
                            ? "text-lg"
                            : "text-base"
                          : "text-xl"
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
      </section>
    </main>
  );
};

export default CurrencyRatesList;
