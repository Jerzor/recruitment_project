const mockedData = [
  [
    1758075360000,
    "116688.00000000",
    "116700.00000000",
    "116650.00000000",
    "116676.57000000",
    "12.345",
    1758075419999,
    "1440000.00000000",
    123,
    "6.789",
    "800000.00000000",
    "0",
  ],
  [
    1758075420000,
    "116676.57000000",
    "116740.00000000",
    "116660.00000000",
    "116720.00000000",
    "10.000",
    1758075479999,
    "1167000.00000000",
    88,
    "5.000",
    "583600.00000000",
    "0",
  ],
  [
    1758075480000,
    "116720.00000000",
    "116730.00000000",
    "116680.00000000",
    "116650.00000000",
    "8.000",
    1758075539999,
    "933200.00000000",
    77,
    "4.000",
    "466600.00000000",
    "0",
  ],
];

describe("getHistoricalMarkteData", () => {
  it("should return all mocked historical data", () => {
    expect(mockedData).toHaveLength(3);
  });

  it("should return array with 12 fields", () => {
    expect(mockedData[0]).toHaveLength(12);
  });

  it("should return min and max price fro  history", () => {
    const formattedData = mockedData.map((klines) => {
      return {
        openTime: klines[0],
        openPrice: klines[1],
        closeTime: klines[6],
        closePrice: klines[4],
      };
    });

    let maxOpenPrice = parseFloat(formattedData[0].openPrice);
    let minOpenPrice = parseFloat(formattedData[0].openPrice);

    for (i = 0; i < formattedData.length; i++) {
      if (parseFloat(formattedData[i].openPrice) > maxOpenPrice) {
        maxOpenPrice = parseFloat(formattedData[i].openPrice).toFixed(1);
      }
    }
    for (i = 0; i < formattedData.length; i++) {
      if (parseFloat(formattedData[i].openPrice) < minOpenPrice) {
        minOpenPrice = parseFloat(formattedData[i].openPrice).toFixed(1);
      }
    }

    expect(maxOpenPrice).toBe("116720.0");
    expect(minOpenPrice).toBe("116676.6");
  });
  it("should return delta", () => {
    const delta = (mockedData[0][4] - mockedData[0][1]) / mockedData[0][1];

    expect(delta.toFixed(10)).toBe("-0.0000979535");
  });
});
