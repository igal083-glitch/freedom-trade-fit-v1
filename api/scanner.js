export default function handler(req, res) {
  const stocks = [
    {
      ticker: "FOSL",
      price: 4.82,
      change: 6.4,
      volume: "HIGH",
      score: 84,
      setup: "Pullback Continuation",
      status: "GREEN"
    },
    {
      ticker: "UUUU",
      price: 5.11,
      change: 2.1,
      volume: "MID",
      score: 67,
      setup: "Base Building",
      status: "YELLOW"
    },
    {
      ticker: "NVAX",
      price: 8.55,
      change: -1.0,
      volume: "LOW",
      score: 61,
      setup: "Watch / Reclaim",
      status: "YELLOW"
    },
    {
      ticker: "PLUG",
      price: 1.02,
      change: -5.2,
      volume: "HIGH",
      score: 38,
      setup: "Weak Structure",
      status: "RED"
    }
  ];

  res.status(200).json(stocks);
}
