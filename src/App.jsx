const stocks = [
  { ticker: "FOSL", price: 4.82, change: 6.4, volume: "HIGH", score: 84, setup: "Pullback Continuation", status: "GREEN" },
  { ticker: "UUUU", price: 5.11, change: 2.1, volume: "MID", score: 67, setup: "Base Building", status: "YELLOW" },
  { ticker: "NVAX", price: 8.55, change: -1.0, volume: "LOW", score: 61, setup: "Watch / Reclaim", status: "YELLOW" },
  { ticker: "PLUG", price: 1.02, change: -5.2, volume: "HIGH", score: 38, setup: "Weak Structure", status: "RED" },
];

export default function App() {
  return (
    <div className="terminal">
      <div className="header">
        <div>
          <h1>Freedom Trading Scanner</h1>
          <p>Bloomberg Pro Mode · Igor Strategy</p>
        </div>
        <div className="badge">IGOR MODE: ON</div>
      </div>

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
              <td className={`status ${s.status.toLowerCase()}`}>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
