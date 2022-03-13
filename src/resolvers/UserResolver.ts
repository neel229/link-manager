import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { User, UserLoginInput, UserRegInput } from "../entities/User";
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
		@Arg("data") newUser: UserRegInput,
		@Ctx() { res }: IContext
	) {
		const user = await this.userService.registerUser(newUser);
		// generate a jwt access token
		const accessToken = signJWT(user, false);
		// generate a jwt refresh token and save it
		// as Http Only cookie
		const refreshToken = signJWT(user, true);
		res.cookie("refresh_token", refreshToken, {
			httpOnly: true
		});
		return {
			...user,
			accessToken
		};
	}

	@Mutation(() => User, { description: "Login a user" })
	async loginUser(@Arg("data") user: UserLoginInput, @Ctx() { res }: IContext) {
		// validate user login credentials
		const validUser = await this.userService.validateLogin(user);
		// generate a jwt access token
		const accessToken = signJWT(validUser, false);
		// generate a jwt refresh token and save it
		// as Http Only cookie
		const refreshToken = signJWT(validUser, true);
		res.cookie("refresh_token", refreshToken, {
			httpOnly: true
		});
		return {
			...validUser,
			accessToken
		};
	}
}
