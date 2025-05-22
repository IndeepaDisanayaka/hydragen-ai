class TextReader {
    text;

    constructor(text) {
        this.text = text;
    }

    async process(id) {
        const object = document.getElementById(id);
        const textLength = this.text.length;
        let isBold = false;

        let fragment = document.createDocumentFragment(); // ✨ create fragment for batching
        var body = document.querySelector(".body");

        for (let i = 0; i < textLength; i++) {
            const selectedText = this.text[i];
            const prevText = this.text[i - 1];

            if (selectedText === "*" && prevText === "*") {
                isBold = !isBold;
                continue;
            }

            const el = document.createElement(isBold ? "strong" : "span");
            el.textContent = selectedText === " " ? "\u00A0" : selectedText === "*" ? "" : selectedText;
            el.className = "text txt-animater";
            fragment.appendChild(el);

            // 💤 Reduce DOM updates frequency
            if (i % 5 === 0 || i === textLength - 1) {
                object.appendChild(fragment);
                fragment = document.createDocumentFragment();

                await new Promise(resolve => setTimeout(resolve, 10)); // 🙏 throttle a bit
                body.scrollTop = body.scrollHeight;
            }
        }

        // 🔚 Final append
        if (fragment.childNodes.length > 0) {
            object.appendChild(fragment);
            body.scrollTop = body.scrollHeight;
        }
    }
}
