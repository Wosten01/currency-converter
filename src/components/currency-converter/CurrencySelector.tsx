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
      defaultValue={selectedOption}
      styles={{
        control: (provided) => ({
          ...provided,
          minHeight: "48px",
          fontSize: "18px",
          "@media (max-width: 768px)": {
            minHeight: "40px",
            fontSize: "16px", 
          },
          "@media (max-width: 480px)": {
            minHeight: "36px", 
            fontSize: "14px",
          },
        }),
        option: (provided) => ({
          ...provided,
          fontSize: "18px",
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 999,
        }),
      }}
    />
  );
};

export default CurrencySelector;
