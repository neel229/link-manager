import { createConnection } from "typeorm";
import { config } from "dotenv";

config();

export const testConn = (drop = false) => {
	return createConnection({
		type: "cockroachdb",
		url: "postgresql://neel:YzLe2GhW7yIgOrfNcznRog@free-tier12.aws-ap-south-1.cockroachlabs.cloud:26257/oslash_test",
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
