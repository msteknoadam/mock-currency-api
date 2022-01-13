import { DbConnection, PostgreQueryService } from "@phiresky/typed-sql";
import pg = require("pg");
import CONFIG from "../../config/config.db";

const pool = new pg.Pool({
	database: CONFIG.dbName,
	user: CONFIG.username,
	password: CONFIG.password,
});

const queryService = new PostgreQueryService(pool, {
	shortenColumnNameIfUnambigous: true,
	skipQuotingIfNotRequired: true,
});

export const dbConnection = new DbConnection(queryService);
