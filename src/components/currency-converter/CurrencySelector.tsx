import Select, { SingleValue } from "react-select";
import { currencyOptions } from "../../data/currency";

export type Option = { value: string; label: string };

interface CustomSelectorProps {
  selectedOption: SingleValue<Option>;
  setSelectedOption: (option: SingleValue<Option>) => void;
}

const CurrencySelector = ({
  selectedOption,
  setSelectedOption,
}: CustomSelectorProps) => {
  const handleChange = (
    option: SingleValue<{ value: string; label: string }>
  ) => {
    setSelectedOption(option);
    console.log("Selected currency:", option ? option.value : null);
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={currencyOptions}
      defaultValue={currencyOptions[0]}
    />
  );
};

export default CurrencySelector;
