async function news(symbol) {
    const api = localStorage.getItem("coindesk");
    if (api == undefined) {
        console.log("Api key failed");
        return;
    }

    const coindesk = document.createElement("button");
    coindesk.className = "cd text";
    coindesk.textContent = symbol
    coindesk.onclick = function () {
        clipInput(this);
    }
    coindesk.ondblclick = function () {
        remove(this);
    }
    var data = "";
    const baseUrl = 'https://data-api.coindesk.com/futures/v1/latest/open-interest/tick';
    const params = { "market": "binance", "instruments": symbol + "-USD-QUANTO-PERPETUAL," + symbol + "-USDT-VANILLA-PERPETUAL", "apply_mapping": "true", "api_key": api };
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();

    const options = {
        method: 'GET',
        headers: { "Content-type": "application/json; charset=UTF-8" },
    };

    await fetch(url, options)
        .then((response) => response.text())
        .then((json) => {
            data += json;

        })
        .catch((err) => console.log(err));


    const baseUrl1 = 'https://data-api.coindesk.com/futures/v1/historical/days';
    const params1 = { "market": "binance", "instrument": symbol + "-USDT-VANILLA-PERPETUAL", "limit": 30, "aggregate": 1, "fill": "true", "apply_mapping": "true", "api_key": api };
    const url1 = new URL(baseUrl1);
    url1.search = new URLSearchParams(params1).toString();

    const options1 = {
        method: 'GET',
        headers: { "Content-type": "application/json; charset=UTF-8" },
    };

    await fetch(url1, options1)
        .then((response) => response.text())
        .then((json) => {
            data += json;

        })
        .catch((err) => console.log(err));


    const baseUrl2 = 'https://data-api.coindesk.com/futures/v1/latest/funding-rate/tick';
    const params2 = { "market": "binance", "instruments": symbol + "-USD-INVERSE-PERPETUAL", "apply_mapping": "true", "api_key": api };
    const url2 = new URL(baseUrl2);
    url2.search = new URLSearchParams(params2).toString();

    const options2 = {
        method: 'GET',
        headers: { "Content-type": "application/json; charset=UTF-8" },
    };

    await fetch(url2, options2)
        .then((response) => response.text())
        .then((json) => {
            data += json;
        })
        .catch((err) => console.log(err));

    await new Promise((resolve) => {
        coindesk.setAttribute("value", data);
        const cdEria = document.querySelector(".cd-eria");
        cdEria.innerHTML = "";
        cdEria.appendChild(coindesk);
        resolve;
    })


}
