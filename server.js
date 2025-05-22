import { GoogleGenAI, Modality } from "@google/genai";
import express from "express";
import cors from "cors";

const port = 5000;
const app = express();
const corsOptions = {
    origin: "*" , // ✅ allow only your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"], // ✅ remove "json"
};

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const API_KEY = "AIzaSyCXDKwlurr6z8d2oL88VxUTx4iH8rlZ6jQ";
const ai = new GoogleGenAI({ apiKey: API_KEY });
async function main(Data) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: Data,
    });
    return response.text;

}

app.use(cors(corsOptions));

app.use(express.json()); // Make sure to add this middleware to parse JSON

app.get('/kline', async (req, res) => {
    const symbol = req.query.symbol;
    const interval = req.query.interval;
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=300`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
});

app.post("/gemini", async (req, res) => {
    const { text } = req.body; // ✅ Get from request body
    const result = await main(text); // Call your main logic
    res.json(result); // Return result as JSON
});

app.get("/gemini/image-gen", async (req, res) => {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyCXDKwlurr6z8d2oL88VxUTx4iH8rlZ6jQ" });

    const { promt } = req.query;
    // Set responseModalities to include "Image" so the model can generate  an image
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: promt,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
    });
    for (const part of response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part.text) {
            console.log(part.text);
        } else if (part.inlineData) {
            const imageData = part.inlineData.data;
         //   const buffer = Buffer.from(imageData, "base64");
            // fs.writeFileSync("asset/" + chatid + ".png", buffer);
            console.log("Image saved as gemini-native-image.png");
            res.send(imageData);
        }
    }
})