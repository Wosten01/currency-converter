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
