import { createConnection } from "typeorm";
import { config } from "dotenv";

config();

export const testConn = (drop = false) => {
	return createConnection({
		type: "cockroachdb",
		url: process.env.DB_URL_TEST,
		ssl: true,
		extra: {
			options: "--cluster=cloned-quokka-306"
		},
		synchronize: drop,
		dropSchema: drop,
		logging: false,
		entities: ["src/entities/**/*.ts"]
	});
};
