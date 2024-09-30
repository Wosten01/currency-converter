import { SingleValue } from "react-select";
import CurrencySelector, { Option } from "./CurrencySelector";

interface CurrencyInputSectionProps {
  title: string;
  selectedCurrency: SingleValue<Option>;
  onCurrencyChange: (currency: SingleValue<Option>) => void;
  amount: string | number;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  conversionRateLabel: string;
}

const CurrencyInputSection = ({
  title,
  selectedCurrency,
  onCurrencyChange,
  amount,
  onInputChange,
  readOnly = false,
  conversionRateLabel,
}: CurrencyInputSectionProps) => {
  return (
    <section className="flex flex-col gap-6 w-full sm:w-5/12">
      <div className="flex flex-col gap-2">
        <h2 className="text-gray-400 font-bold text-base sm:text-xl">
          {title}
        </h2>
        <CurrencySelector
          selectedOption={selectedCurrency}
          setSelectedOption={onCurrencyChange}
        />
      </div>
      <div className="border bg-gray-100 border-gray-300 p-6 rounded-lg">
        <input
          value={amount}
          onInput={onInputChange}
          readOnly={readOnly}
          className="bg-gray-100 text-[#156ada] w-full text-5xl font-bold border-none focus:outline-none focus:ring-0"
        />
        <label className="block text-gray-500 mt-2 text-xl">
          {conversionRateLabel}
        </label>
      </div>
    </section>
  );
};

export default CurrencyInputSection;
