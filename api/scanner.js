const WATCHLIST = ["FOSL", "UUUU", "NVAX", "PLUG", "GERN", "DNA", "BLDP"];

async function fetchYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=3mo&interval=1d`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const data = await response.json();
  const result = data.chart?.result?.[0];

  if (!result) return null;

  const quote = result.indicators.quote[0];
  const timestamps = result.timestamp || [];

  const candles = timestamps.map((t, i) => ({
    date: new Date(t * 1000).toISOString().split("T")[0],
    open: quote.open[i],
    high: quote.high[i],
    low: quote.low[i],
    close: quote.close[i],
    volume: quote.volume[i]
  })).filter(c => c.close && c.volume);

  return candles;
}

function scoreStock(symbol, candles) {
  if (!candles || candles.length < 20) {
    return {
      ticker: symbol,
      price: 0,
      change: 0,
      volume: "NO DATA",
      score: 0,
      setup: "No Data",
      status: "RED"
    };
  }

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const change = ((last.close - prev.close) / prev.close) * 100;

  const avgVol =
    candles.slice(-20).reduce((sum, c) => sum + c.volume, 0) / 20;

  const volRatio = last.volume / avgVol;

  const high20 = Math.max(...candles.slice(-20).map(c => c.high));
  const low20 = Math.min(...candles.slice(-20).map(c => c.low));

  let score = 35;

  if (change > 0) score += 10;
  if (last.close > high20 * 0.92) score += 20;
  if (last.close > low20 * 1.08) score += 10;
  if (volRatio > 1.2) score += 20;

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
    status
  };
}

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      WATCHLIST.map(async (symbol) => {
        const candles = await fetchYahoo(symbol);
        return scoreStock(symbol, candles);
      })
    );

    res.status(200).json(results.sort((a, b) => b.score - a.score));
  } catch (error) {
    res.status(500).json({ error: "Yahoo scanner failed" });
  }
}
