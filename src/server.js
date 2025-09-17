import * as dotenv from "dotenv";
import express from "express";
import { connectDb } from "./db/connectDb.js";
import { getMarketData } from "./services/binance.service.js";
import { klinesDiff } from "./utils/utils.js";

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

  const symbolKlines = await getMarketData(symbol, interval);

  const calcData = symbolKlines.map((kline) => {
    return klinesDiff(
      parseFloat(kline.openPrice),
      parseFloat(kline.closePrice),
    );
  });

  app.listen(port, () => {
    console.info(`Listening on port ${port}`);
  });
};

start();
