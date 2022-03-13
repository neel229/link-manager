import { Server } from "http";
import type { Express } from "express";
import { ApolloServer, ExpressContext } from "apollo-server-express";

/*
 * IServer is an interface which holds the different
 * types of server instances which as a whole act as one server
 */
export interface IServer {
	app: Express;
	httpServer: Server;
	apolloServer: ApolloServer<ExpressContext>;
}
