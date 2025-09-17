import * as dotenv from "dotenv";
import express from "express";
import { connectDb } from "./db/connectDb.js";
import { getMarketData } from "./services/binance.service.js";
import { klinesDiff } from "./utils/utils.js";
import { sortBy } from "lodash-es";

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
  await connectDb();

  //pobieranie historycznych swiec z marketu dla danego symbolu i intervale
  const symbolKlines = await getMarketData(symbol, interval);

  // wykaz wzrostu/spadku ceny w danej swiecy
  const symbolKlinesWithDelta = sortBy(
    symbolKlines.map((kline) => {
      const delta = klinesDiff(
        parseFloat(kline.openPrice),
        parseFloat(kline.closePrice),
      );

      return {
        ...kline,
        delta,
      };
    }),
    "openTime",
  );

  symbolKlinesWithDelta.map((kline) => {});

  console.log(symbolKlinesWithDelta);

  app.listen(port, () => {
    console.info(`Listening on port ${port}`);
  });
};

start();
