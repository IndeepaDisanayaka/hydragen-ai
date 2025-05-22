class TypeWritter {
    text;
    promt;
    constructor(text) {
        this.text = text;
    }
    async process(id) {
        const container = document.getElementById(id);
        container.className = "resp text"
        var body = document.querySelector(".body");
        for (let i = 0; i < this.text.length; i++) {
            const char = this.text[i];
            if (char === "*") continue;

            container.textContent += char;

            await new Promise(resolve => setTimeout(resolve, 10));
            body.scrollTop = body.scrollHeight;
        }
        this.getChartArray();
    }
    getPromt() {
        const match = this.text.match(/#imagePromt:\s*(.+)/);
        if (match) {
            console.log(match[1]);
            return match[1];
        }
        return null;
    }

    getChartArray() {
        const numbers = this.text
            .match(/\[([^\]]+)\]/)[1]   // 👉 "[30, 20, 70, 40]" → "30, 20, 70, 40"
            .split(',')                 // 👉 ["30", "20", "70", "40"]
            .map(n => +n);              // 👉 [30, 20, 70, 40]
         data(numbers);
    }
}