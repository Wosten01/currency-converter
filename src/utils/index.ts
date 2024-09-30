import Decimal from "decimal.js";

export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const formatCurrency = (value: number | Decimal): string => {
  const formattedValue = value.toFixed(4);
  const [integerPart, fractionalPart] = formattedValue.split(".");

  if (fractionalPart && fractionalPart !== "0000") {
    const trimmedFractional = fractionalPart.replace(/0+$/, "");
    return `${integerPart}.${trimmedFractional.substring(0, 4)}`;
  }

  return integerPart;
};


export const formatInputValue = (inputValue: string) => {
  inputValue = inputValue.replace(/,/g, ".");

  const validInput = inputValue.replace(/[^0-9.]/g, "");
  const parts = validInput.split(".");

  const formattedIntegerPart = parts[0].replace(/^0+(?=\d)/, "");
  let formattedInput = formattedIntegerPart;

  if (parts.length > 1) {
    const fractionalPart = parts[1].substring(0, 10);
    formattedInput += `.${fractionalPart}`;
  }

  return formattedInput;
};