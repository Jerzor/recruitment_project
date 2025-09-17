import axios from "axios";

// pobieranie swiec dla symbolu z api binance
export const getMarketData = async (symbol, interval) => {
  const url = process.env.BINANCE_API_URL;

  try {
    const { data } = await axios.get(`${url}/klines`, {
      params: { symbol: symbol, interval },
    });

    // zwraca 12 elementową tablice, interesuje nas otwarcie i zamkniecie danej swiecy
    // wiec pole 2 i 5
    // pole 1 to openTime, pole 7 to closetime
    return data.map((klines) => {
      return {
        openTime: klines[0],
        openPrice: klines[1],
        closeTime: klines[6],
        closePrice: klines[4],
      };
    });
  } catch (err) {
    console.error(err);
  }
};
