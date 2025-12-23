const urlBtcHist =
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=brl&days=365&interval=daily";
const urlEthHist =
  "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=brl&days=365&interval=daily";
const urlSolHist =
  "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=brl&days=365&interval=daily";

async function criarGrafico(url, canvasId, label, color) {
  const response = await fetch(url);
  const data = await response.json();

  const labels = data.prices.map((item) =>
    new Date(item[0]).toLocaleDateString("pt-BR")
  );

  const valores = data.prices.map((item) => item[1]);

  const ctx = document.getElementById(canvasId);

  let cor;

  if (color == 0) {
    cor = "#52cbfbff";
  }
  if (color == 1) {
    cor = "#f8e857ff";
  }
  if (color == 2) {
    cor = "#d255f5ff";
  }

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: valores,
          borderColor: cor,
          borderWidth: 0.5,
          tension: 0.2,
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              context.parsed.y.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
          },
        },
      },
      scales: {
        x: {
          display: false,
          ticks: {
            maxTicksLimit: 5,
          },
        },
        y: {
          display: false,
          ticks: {
            maxTicksLimit: 3,
          },
        },
      },
    },
  });
}

criarGrafico(urlBtcHist, "chartBtc", "Bitcoin", 0);
criarGrafico(urlEthHist, "chartEth", "Ethereum)", 1);
criarGrafico(urlSolHist, "chartSol", "Solana", 2);

const urlMarketCapAtual =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=bitcoin,ethereum,solana";

let chartMarketCap;

async function criarRodaMarketCap() {
  const response = await fetch(urlMarketCapAtual);
  const data = await response.json();

  const labels = data.map((coin) => coin.name);
  const valores = data.map((coin) => coin.market_cap);

  const ctx = document.getElementById("marketCapRoda");

  if (chartMarketCap) {
    chartMarketCap.destroy();
  }

  chartMarketCap = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: valores,
          backgroundColor: ["#52cbfbff", "#f8e857ff", "#d255f5ff"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#ffffff",
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              context.raw.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
              }),
          },
        },
      },
    },
  });
}

criarRodaMarketCap();
setInterval(criarRodaMarketCap, 60000);

const urls = [
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=brl&days=365&interval=daily",
  "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=brl&days=365&interval=daily",
  "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=brl&days=365&interval=daily",
];

async function criarGraficoUnico() {
  const [resBtc, resEth, resSol] = await Promise.all(
    urls.map((url) => fetch(url))
  );
  const [dataBtc, dataEth, dataSol] = await Promise.all([
    resBtc.json(),
    resEth.json(),
    resSol.json(),
  ]);

  const labels = dataBtc.prices.map((item) =>
    new Date(item[0]).toLocaleDateString("pt-BR")
  );

  const ctx = document.getElementById("graficoComparativo");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Bitcoin",
          data: dataBtc.prices.map((i) => i[1]),
          borderColor: "#52cbfbff",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
        },
        {
          label: "Ethereum",
          data: dataEth.prices.map((i) => i[1]),
          borderColor: "#f8e857ff",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
        },
        {
          label: "Solana",
          data: dataSol.prices.map((i) => i[1]),
          borderColor: "#d255f5ff",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, labels: { color: "#fff" } },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: { ticks: { maxTicksLimit: 10 } },
        y: {
          type: "logarithmic",
          ticks: { color: "#ffffffff" },
        },
      },
    },
  });
}

criarGraficoUnico();
