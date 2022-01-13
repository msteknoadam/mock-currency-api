import { from } from "@phiresky/typed-sql";
import express from "express";
import { ratesT } from "../types/db";
import { dbConnection } from "./dbConnection";
const app = express();
const port = process.env.PORT || 3000;

app.get("/convert", async (req, res) => {
	const baseCurr = req.query["base"]?.toString().toLowerCase();
	const symbols = req.query["symbols"]?.toString().toLowerCase();
	if (!baseCurr || !symbols) return res.status(400).send({ error: "Invalid Parameters", satus: 400 });
	try {
		const toCurrs = symbols.split(",");
		const rates = {} as Record<string, number>;

		for (const toCurr of toCurrs) {
			const rate = await dbConnection.firstOrUndefined(
				from(ratesT)
					.select(ratesT.rate)
					.where({ from: baseCurr, to: toCurr })
					.where(ratesT.date.isAtMost(new Date()))
					.orderBy(ratesT.date.desc())
			);

			if (rate) {
				rates[`${baseCurr}-${toCurr}`] = rate.rate;
			} else {
				console.warn(`Couldn't find rate for ${baseCurr}-${toCurr}`);
			}
		}

		res.status(200).send({ data: rates, status: 200 });
	} catch (e) {
		console.error(`Error happened while getting rates for base=${baseCurr} and symbols=${symbols}. e => `, e);
		res.status(500).send({ error: "Unknown Error", status: 500 });
	}
});

app.get("*", (_req, res) => {
	res.send("Hi! Please use '/convert?base=USD&symbols=EUR,TRY' formatted endpoint.");
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
