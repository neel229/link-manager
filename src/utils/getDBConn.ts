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
		url: "postgresql://neel:YzLe2GhW7yIgOrfNcznRog@free-tier12.aws-ap-south-1.cockroachlabs.cloud:26257/oslash_prod",
		ssl: true,
		extra: {
			options: "--cluster=cloned-quokka-306"
		},
		synchronize: true,
		logging: false,
		entities: ["src/entities/**/*.ts"]
	});
};
