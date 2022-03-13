import "reflect-metadata";
import { useContainer as typeOrmUseContainer } from "typeorm";
import { Container } from "typedi";

import { getDBConn } from "./utils/getDBConn";
import { createSchema } from "./utils/createSchema";
import { createServer } from "./utils/createServer";

const main = async () => {
	// build graphql schema
	const schema = await createSchema();
	// set the container for TypeORM DI
	typeOrmUseContainer(Container);
	// create a connection with db
	await getDBConn();
	// create a server instance
	const server = await createServer(schema);

	// start the server on port 6900
	await new Promise<void>((resolve) => {
		server.httpServer.listen({ port: 6900 }, resolve);
	});
	console.log("listening on port 6900");
};

main().catch((err) => console.error(err));
