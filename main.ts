// @ts-types="npm:@types/express@latest"
import express from "npm:express@latest";
import {getCurrencyFromBCV, Currency} from "jsr:@quikiesamus/scrape-bcv"

const app = express();
const PORT = (Deno.env.get("PORT")) || 3000;

/**
 * This is the representation of the response made by the server
 */
type CurrencyResponse = {
    [currency: string]: number 
}

app.get("/currencies", (_req, res) => {
    const response: CurrencyResponse = {};
    const promises = Object.entries(Currency).map(async (currencyEnum) => {
        const currency = await getCurrencyFromBCV(currencyEnum[1]);
        response[currencyEnum[0]] = currency;
    });
    Promise.all(promises).then(() => res.json(response));
});

app.get("/currencies/:name", (req, res) => {
    const name: keyof typeof Currency = req.params.name as keyof typeof Currency; 
    const response: CurrencyResponse = {};
    getCurrencyFromBCV(Currency[name]).then((currencyValue) => {
        response[name] = currencyValue;
        res.json(response);
    }).catch((err) => {
        res.type("text");
        res.status(404).send(`${name} not found. ${err.toString()}`);
        res.end();
    });
})

app.all("*", (_req, res) => {
    res.type("text");
    res.status(404).send("not found");
    res.end();
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));