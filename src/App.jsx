const stocks = [
  {
    ticker: "UUUU",
    name: "Energy Fuels",
    color: "yellow",
    score: 67,
    setup: "Building base",
    why: "יש עניין בסקטור, אבל צריך פריצה עם ווליום",
  },
  {
    ticker: "FOSL",
    name: "Fossil Group",
    color: "green",
    score: 84,
    setup: "Pullback continuation",
    why: "מבנה חי, תיקון מסודר, מתאים לקמפיין",
  },
  {
    ticker: "NVAX",
    name: "Novavax",
    color: "yellow",
    score: 61,
    setup: "Watchlist",
    why: "פוטנציאל קיים, אבל צריך reclaim ברור",
  },
  {
    ticker: "PLUG",
    name: "Plug Power",
    color: "red",
    score: 38,
    setup: "Weak structure",
    why: "מבנה חלש, עליות נמכרות מהר",
  },
];

export default function App() {
  return (
    <div className="app">
      <h1>Freedom Trading Scanner</h1>
      <p>מניות חמות לפי השיטה שלך: ירוק / צהוב / אדום</p>

      <div className="grid">
        {stocks.map((s) => (
          <div key={s.ticker} className={`scanner-card ${s.color}`}>
            <div className="top">
              <h2>{s.ticker}</h2>
              <span>{s.color === "green" ? "🟢 GREEN" : s.color === "yellow" ? "🟡 YELLOW" : "🔴 RED"}</span>
            </div>

            <p className="name">{s.name}</p>
            <p className="score">Score: {s.score}/100</p>
            <p><b>Setup:</b> {s.setup}</p>
            <p className="why">{s.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
