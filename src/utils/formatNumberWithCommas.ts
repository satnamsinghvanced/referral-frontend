export const formatNumberWithCommas = (value: number | string): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("en-US").format(number);
};
