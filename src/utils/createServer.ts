import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import type { GraphQLSchema } from "graphql";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { IServer } from "src/interfaces/server";

/**
 *
 * @param schema A graphql schema
 * @returns An instance of IServer interface
 */
export const createServer = async (schema: GraphQLSchema): Promise<IServer> => {
	const app = express();
	const httpServer = http.createServer(app);
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }) => {
			return {
				req,
				res
			};
		},
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
	});
	await apolloServer.start();
	apolloServer.applyMiddleware({ app });

	return { app, httpServer, apolloServer };
};
