import type { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { Container } from "typedi"; // Ioc Container

import { resolvers } from "../resolvers/index";

/**
 *
 * @returns A GraphQL schema
 */
export const createSchema = async (): Promise<GraphQLSchema> => {
	return await buildSchema({
		resolvers,
		container: Container
	});
};
