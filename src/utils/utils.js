// obliczanie zmiany cen miedzy otwarcie a zamknieciem swiecy
export const klinesDiff = (open, close) => (close - open) / open;
