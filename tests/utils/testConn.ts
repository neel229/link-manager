import { createConnection } from "typeorm";

export const testConn = (drop = false) => {
	return createConnection({
		type: "cockroachdb",
		host: "localhost",
		port: 26257,
		username: "neel229",
		password: "",
		database: "oslash_test",
		synchronize: drop,
		dropSchema: drop,
		logging: false,
		entities: ["src/entities/**/*.ts"]
	});
};
