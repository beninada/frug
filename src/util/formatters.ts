export const usdFormatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const tickFormatter = (value: number): string => {
  if (value > 1000000000) {
    return `$${(value / 1000000000).toString()}B`;
  } else if (value > 1000000) {
    return `$${(value / 1000000).toString()}M`;
  } else if (value > 10000) {
    return `$${(value / 1000).toString()}K`;
  } else {
    return `$${value.toString()}`;
  }
};
