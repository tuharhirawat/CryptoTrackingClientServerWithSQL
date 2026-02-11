import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getMarketCoins = async (currency = "usd") => {
  const res = await api.get("/coins/markets", {
    params: {
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: 250,
      page: 1,
      sparkline: false,
    },
  });
  return res.data;
};

export const getSupportedCurrencies = async () => {
  const res = await api.get("/simple/supported_vs_currencies");
  return res.data;
};

export const CURRENCY_SYMBOLS = {
  usd: "$",
  eur: "€",
  inr: "₹",
  gbp: "£",
  jpy: "¥",
};

export const getCurrencySymbol = (currency) =>
  CURRENCY_SYMBOLS[currency?.toLowerCase()] || currency.toUpperCase();
