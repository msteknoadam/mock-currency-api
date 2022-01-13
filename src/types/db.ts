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

export const ratesT = table(
	{ name: "rates", schema: "public" },
	{
		from: tText,
		to: tText,
		rate: tNumeric,
	},
	{ id: tInteger, date: timestamptz }
);
