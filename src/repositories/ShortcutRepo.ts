import { EntityRepository, Repository } from "typeorm";
import { Shortcut } from "../entities/Shortcut";

@EntityRepository(Shortcut)
export class ShortcutRepo extends Repository<Shortcut> {}
