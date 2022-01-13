import { table, tText, tInteger, tNumeric, Type } from "@phiresky/typed-sql";

class PGTimestampType extends Type<Date, Date, "timestamptz"> {
	name = "timestamptz";
	serialize(arg: Date): string | number | boolean {
		return arg as any;
	}

	deserialize(arg: string | number | boolean): Date {
		return new Date("" + arg);
	}
}
const timestamptz = new PGTimestampType();

export const fiatRatesT = table(
	{ name: "fiat-rates", schema: "public" },
	{
		from: tText,
		to: tText,
		rate: tNumeric,
	},
	{ id: tInteger, date: timestamptz }
);

export const cryptoRatesT = table(
	{ name: "crypto-rates", schema: "public" },
	{
		from: tText,
		to: tText,
		name: tText,
		rate: tNumeric,
		volume_24h: tNumeric,
	},
	{ id: tInteger, date: timestamptz }
);
