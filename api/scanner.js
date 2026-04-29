const WATCHLIST = ["FOSL", "UUU", "UUUU", "NVAX", "PLUG", "GERN", "DNA", "BLDP"];

async function fetchCandles(symbol) {
  const url = `https://stooq.com/q/d/l/?s=${symbol.toLowerCase()}.us&i=d`;
  const response = await fetch(url);
  const text = await response.text();

  const rows = text.trim().split("\n").slice(1);

  return rows
    .map((row) => {
      const [date, open, high, low, close, volume] = row.split(",");
      return {
        date,
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume),
      };
    })
    .filter((x) => x.date && Number.isFinite(x.close));
}

function scoreStock(symbol, candles) {
  if (!candles || candles.length < 30) {
    return {
      ticker: symbol,
      price: 0,
      change: 0,
      volume: "NO DATA",
      score: 0,
      setup: "No Data",
      status: "RED",
    };
  }

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const change = ((last.close - prev.close) / prev.close) * 100;

  const avgVol =
    candles.slice(-20).reduce((sum, c) => sum + (c.volume || 0), 0) / 20;

  const volRatio = avgVol ? last.volume / avgVol : 1;

  const highs20 = candles.slice(-20).map((c) => c.high);
  const high20 = Math.max(...highs20);

  const lows20 = candles.slice(-20).map((c) => c.low);
  const low20 = Math.min(...lows20);

  const nearHigh = last.close > high20 * 0.92;
  const aboveRangeLow = last.close > low20 * 1.08;
  const volumeStrong = volRatio > 1.2;
  const positiveDay = change > 0;

  let score = 35;
  if (positiveDay) score += 10;
  if (nearHigh) score += 20;
  if (aboveRangeLow) score += 10;
  if (volumeStrong) score += 20;

  score = Math.min(100, Math.round(score));

  const status = score >= 70 ? "GREEN" : score >= 45 ? "YELLOW" : "RED";

  const setup =
    status === "GREEN"
      ? "Momentum / Continuation"
      : status === "YELLOW"
      ? "Building / Watch"
      : "Weak / Avoid";

  const volume =
    volRatio > 1.4 ? "HIGH" : volRatio > 0.8 ? "MID" : "LOW";

  return {
    ticker: symbol,
    price: Number(last.close.toFixed(2)),
    change: Number(change.toFixed(2)),
    volume,
    score,
    setup,
    status,
  };
}

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      WATCHLIST.map(async (symbol) => {
        const candles = await fetchCandles(symbol);
        return scoreStock(symbol, candles);
      })
    );

    const sorted = results.sort((a, b) => b.score - a.score);

    res.status(200).json(sorted);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scanner data" });
  }
}
