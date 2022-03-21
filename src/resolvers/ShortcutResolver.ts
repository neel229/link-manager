import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware
} from "type-graphql";
import { Service } from "typedi";

import { Shortcut, NewShortcutInput, SortInput } from "../entities/Shortcut";
import { isAuth } from "../middlewares/auth";
import { IContext } from "../interfaces/context";
import { ShortcutService } from "../services/ShortcutService";
import { UserService } from "../services/UserService";

@Service()
@Resolver(() => Shortcut)
export class ShortcutResolver {
	constructor(
		private readonly userService: UserService,
		private readonly shortcutService: ShortcutService
	) {}

	@Mutation(() => Shortcut)
	@UseMiddleware(isAuth)
	// Resolver for creating a new shortcut
	async createShortcut(
		@Arg("data") newShortcut: NewShortcutInput,
		@Ctx() { payload }: IContext
	): Promise<Shortcut> {
		if (!payload?.userId) throw new Error("Invalid Authentication");
		const user = await this.userService.getUser(payload?.userId);
		return await this.shortcutService.createShortcut(newShortcut, user);
	}

	@Mutation(() => String)
	@UseMiddleware(isAuth)
	// Resolver for deleting a shortcut
	async deleteShortcut(
		@Arg("data") shortcutId: string,
		@Ctx() { payload }: IContext
	): Promise<string> {
		if (!payload?.userId) throw new Error("Invalid Authentication");
		return await this.shortcutService.deleteShortcut(shortcutId);
	}

	@Query(() => [Shortcut])
	@UseMiddleware(isAuth)
	// Resolver for fetching all the shortcuts
	async getShortcuts(
		@Arg("data", { nullable: true }) input: SortInput,
		@Ctx() { payload }: IContext
	): Promise<Shortcut[]> {
		if (!payload?.userId) throw new Error("Invalid Authentication");
		const user = await this.userService.getUser(payload?.userId);
		if (!input) {
			return await this.shortcutService.getShortcuts(user);
		} else {
			return await this.shortcutService.getShortcuts(user, input);
		}
	}

	@Query(() => [Shortcut])
	@UseMiddleware(isAuth)
	// Resolver for searching shortcuts based on a string
	async searchShortcuts(
		@Arg("data") searchText: string,
		@Ctx() { payload }: IContext
	): Promise<Shortcut[]> {
		if (!payload?.userId) throw new Error("Invalid Authentication");
		const user = await this.userService.getUser(payload?.userId);
		if (!user) throw new Error("Invalid user");

		const shortcuts = await this.shortcutService.searchShortcuts(searchText);
		shortcuts.forEach((item) => {
			item.user = user;
		});
		return shortcuts;
	}
}
