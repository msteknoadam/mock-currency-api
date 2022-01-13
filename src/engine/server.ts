import { from } from "@phiresky/typed-sql";
import express from "express";
import { fiatRatesT } from "../types/db";
import { dbConnection } from "./dbConnection";
const app = express();
const port = process.env.PORT || 3000;

app.get("/convert-fiat", async (req, res) => {
	const baseCurr = req.query["base"]?.toString().toUpperCase();
	const symbols = req.query["symbols"]?.toString().toUpperCase();
	if (!baseCurr || !symbols) return res.status(400).send({ success: false, error: "Invalid Parameters" });
	try {
		const toCurrs = symbols.split(",");
		const rates = {} as Record<string, number>;
		let timestamp: number | null = null;

		for (const toCurr of toCurrs) {
			const rate = await dbConnection.firstOrUndefined(
				from(fiatRatesT)
					.select(fiatRatesT.rate, fiatRatesT.date)
					.where({ from: baseCurr, to: toCurr })
					.where(fiatRatesT.date.isAtMost(new Date()))
					.orderBy(fiatRatesT.date.desc())
			);

			if (rate) {
				rates[toCurr] = +rate.rate;
				if (!timestamp) timestamp = new Date(rate.date).getTime();
			} else {
				console.warn(`Couldn't find rate for ${baseCurr}-${toCurr}`);
			}
		}

		res.status(200).send({
			success: true,
			timestamp: Math.round((timestamp || Date.now()) / 1000),
			base: baseCurr,
			date: new Date(timestamp || Date.now()).toISOString().split("T")[0],
			rates,
		});
	} catch (e) {
		console.error(`Error happened while getting rates for base=${baseCurr} and symbols=${symbols}. e => `, e);
		res.status(500).send({ success: false, error: "Unknown Error" });
	}
});

app.get("*", (_req, res) => {
	res.send(
		"Hi!<br />For fiat conversions, please use Please use '/convert-fiat?base=USD&symbols=EUR,TRY' formatted endpoint."
	);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
