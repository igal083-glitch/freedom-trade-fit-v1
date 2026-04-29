import { useEffect, useState } from "react";

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadScanner() {
    setLoading(true);
    const res = await fetch("/api/scanner");
    const data = await res.json();
    setStocks(data);
    setLoading(false);
  }

  useEffect(() => {
    loadScanner();
  }, []);

  return (
    <div className="terminal">
      <div className="header">
        <div>
          <h1>Freedom Trading Scanner</h1>
          <p>Bloomberg Pro Mode · Igor Strategy · API Connected</p>
        </div>
        <button onClick={loadScanner}>Refresh Scanner</button>
      </div>

      {loading ? (
        <div className="loading">Loading scanner...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Price</th>
              <th>Change</th>
              <th>Volume</th>
              <th>Score</th>
              <th>Setup</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((s) => (
              <tr key={s.ticker}>
                <td className="ticker">{s.ticker}</td>
                <td>${s.price.toFixed(2)}</td>
                <td className={s.change >= 0 ? "up" : "down"}>
                  {s.change >= 0 ? "+" : ""}
                  {s.change.toFixed(1)}%
                </td>
                <td>{s.volume}</td>
                <td>{s.score}/100</td>
                <td>{s.setup}</td>
                <td className={`status ${s.status.toLowerCase()}`}>
                  {s.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
