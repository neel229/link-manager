import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { User, UserRegInput } from "../entities/User";
import { UserService } from "../services/UserService";
import { IContext } from "../interfaces/context";
import { signJWT } from "../utils/jwt";

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
	async registerUser(
		@Arg("data") user: UserRegInput,
		@Ctx() { res }: IContext
	) {
		const newUser = await this.userService.registerUser(user);
		// generate a jwt access token
		const accessToken = signJWT(newUser, false);
		// generate a jwt refresh token and save it
		// as Http Only cookie
		const refreshToken = signJWT(newUser, true);
		res.cookie("refresh_token", refreshToken, {
			httpOnly: true
		});
		return {
			...newUser,
			accessToken
		};
	}
}
