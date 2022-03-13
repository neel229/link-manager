import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Shortcut, NewShortcutInput } from "../entities/Shortcut";
import { User } from "../entities/User";
import { ShortcutRepo } from "../repositories/ShortcutRepo";

/**
 * The ShortcutService class contains functions that deals
 * with Shortcut entity.
 */
@Service()
export class ShortcutService {
	@InjectRepository(ShortcutRepo)
	private readonly shortcutRepo: ShortcutRepo;

	// create a new shortcut
	async createShortcut(
		newShortcut: NewShortcutInput,
		user: User
	): Promise<Shortcut> {
		return await this.shortcutRepo.save({
			shortLink: newShortcut.shortLink,
			description: newShortcut.description,
			sourceURL: newShortcut.sourceURL,
			tags: newShortcut.tags,
			user: user
		});
	}

	// get a list shortcuts
	async getShortcuts(user: User): Promise<Shortcut[]> {
		return await this.shortcutRepo.find({ where: { user } });
	}

	async deleteShortcut(shortcutId: string): Promise<string> {
		const shortcut = await this.shortcutRepo.findOne({
			where: { id: shortcutId }
		});
		if (!shortcut)
			throw new Error("Shortcut with given shortlink doesn't exist");
		await this.shortcutRepo.delete(shortcutId);
		return shortcut.id;
	}
}
