import express from "npm:express@latest";
import {getCurrencyFromBCV, Currency} from "jsr:@quikiesamus/scrape-bcv"
const app = express();

type CurrencyResponse = {
    [currency: string]: number 
}

app.get("/currency", (req, res) => {
    const response: CurrencyResponse = {};
    const promises = Object.entries(Currency).map(async (currencyEnum) => {
        const currency = await getCurrencyFromBCV(currencyEnum[1]);
        console.log(currency);
        response[currencyEnum[0]] = currency;
    });
    Promise.all(promises).then(() => res.json(response));
});

app.get("/currency/:name", (req, res) => {
    const name: keyof typeof Currency = req.params.name; 
    const response: CurrencyResponse = {};
    getCurrencyFromBCV(Currency[name]).then((currencyValue) => {
        response[Currency[name]] = currencyValue;
        res.json(response);
    }).catch((err) => {
        res.type("text");
        res.status(400).send(`${name} not found. ${err.toString()}`);
        res.end();
    });
})

app.all("*", (req, res) => {
    res.type("text");
    res.status(404).send("not found");
    res.end();
})

app.listen(8000, () => console.log("Server running on port 8000"));