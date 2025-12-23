async function GetValor() {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=brl";

  try {
    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("btcValor").textContent =
      data.bitcoin.brl.toLocaleString("pt-BR");
    document.getElementById("ethValor").textContent =
      data.ethereum.brl.toLocaleString("pt-BR");
    document.getElementById("solValor").textContent =
      data.solana.brl.toLocaleString("pt-BR");
  } catch (err) {
    console.error(err);
  }
}

setInterval(GetValor, 10000);
GetValor();
