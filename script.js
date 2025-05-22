var symbol = document.getElementById("symbol");
const klineCandleIntervel = document.getElementById("klineCandle-intervel");
var interveled_price;
async function load(symbol_selected) {
    let oldPrice = 0
    interveled_price = setInterval(async () => {
        const data = await price(symbol_selected);
        if (oldPrice >= data.price) {
            symbol.style.color = "red"
        } else {
            symbol.style.color = "green"
        }

        symbol.textContent = data.symbol + " | " + data.price;
        oldPrice = data.price;

    }, 1000);

    const api = localStorage.getItem("coindesk");
    const setapiBtn = document.querySelector(".setapiBtn");
    const removeapiBtn = document.querySelector(".removeapiBtn");
    if (api == undefined) {
        setapiBtn.style.display = "flex";
        removeapiBtn.style.display = "none";
    } else {
        setapiBtn.style.display = "none";
        removeapiBtn.style.display = "flex";
    }



}
async function send(event) {

    if (event != undefined && event.keyCode != 13)
        return;

    var input = document.getElementById("req-value");
    if (input.value == "")
        return;
    const optionBtn = document.querySelector(".option-btn");
    optionBtn.disabled = true;
    optionBtn.style.cursor = "no-drop";
    const srm = document.getElementById("srm");
    var spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    const body = document.querySelector(".body");
    const response = await fetch("https://hydragen-ai.vercel.app/gemini", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // 🔥 Required for express.json()
        },
        body: JSON.stringify({
            text: input.value + "!important , giv recommandation to swing or logtime trade," +
                "giv future market datials probelitys up or down ,and what are the good entry points to buy this coin, short response," +
                "use probelity numbers eg 10%up , use original sinhala charactor lanvague , and it best for buy or sell on this time," +
                "this is the now live coin price : " + symbol.textContent + " ," +
                "Also, use #chartData as the main variable and create an array with this data," +
                " eg: [swing probelity, buy probelity, sell probelity, loneterm probelity] ,The probability types I have provided must exist. Like this #chartData: [10( dont use symbols and charactors),3( dont use symbols and charactors),5( dont use symbols and charactors),100( dont use symbols and charactors)] in this array all only int , There cannot be zero values," +
                "Two probabilities related to the same part cannot appear at the same time, Also, it is imperative to follow this: the value '0%'-'100%' should be a positive idea, ranging from a negative idea ," +
                " finaly make promt for generate image using this datials in eng best the final decisition it varible is #imagePromt this varible is important. ex #imagePromt:now type your promt , add image promt to probality report and professional",
        }),
    })

    const my = document.createElement("div");
    my.className = "my";
    const text1 = document.createElement("span");
    text1.textContent = input.value;
    text1.className = "text";
    my.appendChild(text1);

    const resp = document.createElement("div");
    resp.className = "resp";

    const randomValue = Math.random().toString().slice(2, 11);;
    console.log(randomValue);

    resp.setAttribute("id", "resp-" + randomValue);
    (async () => {
        if (srm.checked) {
            var typeWritter = new TypeWritter(await response.json());
            await typeWritter.process("resp-" + randomValue);
            const promt = typeWritter.getPromt();
            if (promt) {
                const spinner = document.createElement("dotlottie-player");

                spinner.setAttribute("src", "https://lottie.host/3ad46813-d506-4fd5-be28-f1ddc1e69eee/FTFAqgaODs.lottie");
                spinner.setAttribute("background", "transparent");
                spinner.setAttribute("speed", "1");
                spinner.setAttribute("style", "width: 50px; height: 50px;");
                spinner.setAttribute("loop", "");
                spinner.setAttribute("autoplay", "");

                resp.appendChild(spinner);
                const imgGen = await fetch("https://hydragen-ai.vercel.app/gemini/image-gen?promt=" + promt + "&&chatid=" + randomValue, {
                    method: "GET",
                }).catch((error) => {
                    alert(error)
                })

                spinner.remove();
                const img = document.createElement("img");
                img.setAttribute("src", "data:image/jpeg;charset=utf-8;base64," + await imgGen.text());
                img.style.width = "90%";
                body.appendChild(img);

            }


        } else {
            await new TextReader(await response.json()).process("resp-" + randomValue);
        }
    })();

    input.value = "";

    body.appendChild(my);
    body.appendChild(resp);
    spinner.style.display = "none";
    optionBtn.disabled = false;
    optionBtn.style.cursor = "pointer";
    changeInput(input, 'length');
}
function clipInput(element) {
    var input = document.getElementById("req-value");
    var elValue = element.getAttribute("value");
    input.value += elValue;
    changeInput(input, 'length');
}


function remove(element) {
    element.remove();
}


async function symbolSelect(element) {
    news(element.value);
    clearInterval(interveled_price);
    load(element.value + "USDT");
    changenterval();
}


const selectSymbol = document.getElementById("symbol-select");
async function changenterval() {
    const candleEria = document.querySelector(".candle-eria");
    candleEria.innerHTML = "";
    const button = document.createElement("button");

    const response = await fetch(`https://hydragen-ai.vercel.app/kline?symbol=${selectSymbol.value + "USDT"}&&interval=${klineCandleIntervel.value}`, {
        method: "GET",
    }).catch((error) => {
        console.log(error);
    })
    button.setAttribute("value", await response.text());
    button.textContent = selectSymbol.value + " " + klineCandleIntervel.value;
    button.className = "cd text";
    button.ondblclick = function () {
        remove(this);
    }
    button.onclick = function () {
        addInput(this);
    }
    candleEria.appendChild(button);

    document.getElementById("candle-time-range").innerHTML = "Used " + klineCandleIntervel.value + " Candles to Analysis";
}

function addInput(element) {
    var input = document.getElementById("req-value");
    var elValue = element.getAttribute("value");
    input.value += "This array contains the behavior of the " + klineCandleIntervel.value + " candles of " + selectSymbol.value + "USDT from binance futures. You have to analyze the rsi and macd together and give me a decision : [" + elValue + "]";
    changeInput(input, 'length');
}

function changeInput(element, id) {
    document.getElementById(id).textContent = "Length : " + element.value.length;
}

async function setApi() {
    const { value: api } = await Swal.fire({
        title: "Enter your coinDesk API key",
        input: "text",
        inputLabel: "Api key",
        inputPlaceholder: "",
        inputAttributes: {
            autocapitalize: "off",
            autocorrect: "off"
        }
    });
    if (api) {
        localStorage.setItem("coindesk", api);
        window.location.reload();
    }
}
