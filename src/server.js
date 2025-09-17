import * as dotenv from "dotenv";
import express from "express";
import { getMarketData } from "./services/binance.service.js";
import { klinesDiff } from "./utils/utils.js";
import { maxBy, minBy, sortBy } from "lodash-es";

dotenv.config();

const app = express();
app.use(express.json());
app.get("/ping", (req, res) => {
  res.json({ status: "pong" });
});

const port = process.env.PORT || 3000;
const symbol = process.env.SYMBOL;
const interval = process.env.INTERVAL;

const start = async () => {
  // nie ma potrzeby łączenia sie z DB
  // await connectDb();

  //pobieranie historycznych swiec z marketu dla danego symbolu i intervale
  const symbolKlines = await getMarketData(symbol, interval);

  // wykaz wzrostu/spadku ceny w danej swiecy
  const symbolKlinesWithDelta = sortBy(
    symbolKlines.map((kline) => {
      const delta = klinesDiff(
        parseFloat(kline.openPrice),
        parseFloat(kline.closePrice),
      );

      // kolor mówiacy o tym, czy swieca zamkneła sie ze wzrostem, spadkiem czy bez zmain
      // mozna tez po delcie sprawdzać
      const klineColor =
        kline.closePrice === kline.openPrice
          ? "neutral"
          : kline.closePrice > kline.openPrice
            ? "green"
            : "red";

      return {
        ...kline,
        delta,
        klineColor,
      };
    }),
    "openTime",
  );

  const sortedDeltas = symbolKlinesWithDelta.map((kline) => {
    return kline.delta;
  });

  let accumulator = 1;

  sortedDeltas.map((delta) => {
    // 1 + delta musi być wieksze od 0
    if (1 + delta > 0) accumulator *= 1 + delta;
  });

  //skumulowany zwrot okresu w ujeciu prostym w %
  const cumulative = (accumulator - 1) * 100;
  const cumulativePercentage = `${cumulative.toFixed(4)}%`;

  console.log(
    `Świece dla interwału: ${interval}, dla symbolu: ${symbol}: `,
    symbolKlinesWithDelta,
  );

  const deltaMax = maxBy(symbolKlinesWithDelta, "delta").delta.toFixed(4);
  const deltaMin = minBy(symbolKlinesWithDelta, "delta").delta.toFixed(4);

  console.log(`Maksymalne odchylenie delta = ${deltaMax}`);
  console.log(`Minimalne odchylenie delta = ${deltaMin}`);

  console.log(
    "Skumulowany zwrot okresu w ujeciu prostym:",
    cumulativePercentage,
  );

  app.listen(port, () => {
    console.info(`Listening on port ${port}`);
  });
};

start();
