const FUTURE_URL = "https://fapi.binance.com/fapi/";

async function price(symbol) {
    const response = await fetch(FUTURE_URL + "v1/ticker/price" + "?symbol=" + symbol, {
        method: "GET",
    })
    return await response.json();
}

async function klineCandle(symbol, intervel) {
 
}


