import { testConn } from "./testConn";
import { createSchema } from "../../src/utils/createSchema";
import { createServer } from "../../src/utils/createServer";
import { useContainer as typeOrmUseContainer } from "typeorm";
import { Container } from "typedi";

export const startServer = async () => {
	const schema = await createSchema();
	typeOrmUseContainer(Container);
	const conn = await testConn();
	const server = await createServer(schema);

	return {
		conn,
		server
	};
};
