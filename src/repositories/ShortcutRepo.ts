/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityRepository, Repository } from "typeorm";
import { Shortcut } from "../entities/Shortcut";

@EntityRepository(Shortcut)
export class ShortcutRepo extends Repository<Shortcut> {
	// searchShortcut is a custom method on ShortcutRepo which searches
	// if the given string is contained within either of shortLink, description, or tags
	// and returns shortcuts which does
	async searchShortcuts(searchText: string): Promise<Shortcut[]> {
		try {
			const shortcuts: any = await this.manager.query(`
			SELECT * FROM shortcut
			WHERE (description LIKE '%${searchText}%')
			OR (tags LIKE '${searchText}')
			OR (short_link LIKE '${searchText}')
			;
		`);
			shortcuts.forEach((item: any) => {
				// assign value of short_link to shortLink for graphql shortcut type
				item["shortLink"] = item["short_link"];
				// assign value of source_url to sourceURL for graphql shortcut type
				item["sourceURL"] = item["source_url"];
				// convert the tags string to an iterable array
				if (item.tags !== null) {
					item.tags = item.tags.split(",");
				}
			});
			return shortcuts as Shortcut[];
		} catch (err) {
			console.error(err);
			throw new Error("error querying shortcuts");
		}
	}
}
