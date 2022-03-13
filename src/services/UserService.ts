import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import argon2 from "argon2";

import { UserRegInput } from "../entities/User";
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
	async registerUser(user: UserRegInput) {
		// hash the password before saving it
		user.password = await argon2.hash(user.password);
		return await this.userRepo.save(user);
	}
}
