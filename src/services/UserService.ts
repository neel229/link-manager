import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import argon2 from "argon2";

import { User, UserLoginInput, UserRegInput } from "../entities/User";
import { UserRepo } from "../repositories/UserRepo";

/**
 * The UserService class contains functions that deals
 * with User entity.
 */
@Service()
export class UserService {
	@InjectRepository(UserRepo)
	private readonly userRepo: UserRepo;

	// creates a new user record
	async registerUser(user: UserRegInput): Promise<User> {
		// NOTE: Since the email field is required and unique
		// there's no point in checking if the user already exists

		// hash the password before saving it
		user.password = await argon2.hash(user.password);
		return await this.userRepo.save(user);
	}

	// check if user login credentials are valid
	async validateLogin(user: UserLoginInput): Promise<User> {
		// check if the user exists
		const getUser = await this.userRepo.findOne({
			where: { email: user.email }
		});
		if (!getUser) throw new Error("User with given email doesn't exist");
		// validate the password
		const valid = await argon2.verify(getUser.password, user.password);
		if (!valid) throw new Error("Invalid password, try again!");

		// if everything is valid, return the user object
		return getUser;
	}
}
