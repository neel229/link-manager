import { UserResolver } from "./UserResolver";
import { ShortcutResolver } from "./ShortcutResolver";

export const resolvers = [UserResolver, ShortcutResolver] as const;
