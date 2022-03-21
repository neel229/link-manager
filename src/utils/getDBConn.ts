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
		url: process.env.DB_URL_PROD,
		ssl: true,
		extra: {
			options: "--cluster=cloned-quokka-306"
		},
		synchronize: true,
		logging: false,
		entities: ["src/entities/**/*.ts"]
	});
};
