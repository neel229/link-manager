import { Connection, createConnection } from "typeorm";
import { config } from "dotenv";

config();

/**
 *
 * @returns A database orm connection
 */
export const getDBConn = async (): Promise<Connection> => {
	return await createConnection({
		type: "cockroachdb",
		host: "localhost",
		port: 26257,
		username: "neel229",
		password: "",
		database: "oslash",
		synchronize: true,
		logging: false,
		entities: ["src/entities/**/*.ts"]
	});
};
