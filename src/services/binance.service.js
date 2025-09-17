import axios from "axios";

// pobieranie swiec dla symbolu z api binance
export const getMarketData = async (symbol, interval) => {
  const url = process.env.BINANCE_API_URL;

  try {
    const { data } = await axios.get(`${url}/klines`, {
      params: { symbol: symbol, interval },
    });

    return data;
  } catch (err) {
    console.error(err);
  }
};
