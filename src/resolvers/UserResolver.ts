import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { User, UserRegInput } from "../entities/User";
import { UserService } from "../services/UserService";

/**
 * The UserResolver class contains all the graphql resolvers
 * related to the User entity.
 */

@Service()
@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	// TODO: Remove in future
	@Query(() => String)
	hello() {
		return "hello";
	}

	@Mutation(() => User, { description: "Creates a new user record in the db" })
	async registerUser(@Arg("data") user: UserRegInput) {
		return this.userService.registerUser(user);
	}
}
