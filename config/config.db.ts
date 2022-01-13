/**
 * To define your own config, you can just create "config.db.local.ts" 
 * inside this directory and set it's content as the following:
 * 
        import { DbConfigType } from "./config.db";

        const config: Partial<DbConfigType> = {
            dbName: "dbName",
            username: "username",
            password: "password",
        };

        export default config;

 * Local config files are set so that they are ignored by git and therefore
 *        they will be kept only on your local computer.
 */

import * as fs from "fs";
import * as path from "path";

const CONFIG = {
	dbName: "dbName",
	username: "username",
	password: "password",
};

export type DbConfigType = typeof CONFIG;

const mergedConfig: DbConfigType = CONFIG;

if (fs.existsSync(path.join(__dirname, "config.db.local.ts"))) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	Object.assign(mergedConfig, require("./config.db.local").default);
}

export default CONFIG;
