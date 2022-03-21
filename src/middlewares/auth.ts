/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IContext } from "../interfaces/context";
import type { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { verifyJWT } from "../utils/jwt";

// isAuth is a middleware which checks if the passed jwt auth token is valid.
// If not valid, it'll throw Invalid token. If valid but expired, it will throw
// Not Authenticated error
export const isAuth: MiddlewareFn<IContext> = async ({ context }, next) => {
	const auth = context.req.headers["authorization"];
	if (!auth) throw new Error("Not Authenticated");
	try {
		const sig = auth.split(" ")[0];
		if (sig !== "Bearer") throw new Error("Invalid token type");
		const token = auth.split(" ")[1];
		const payload = verifyJWT(token);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context.payload = payload as any;
	} catch (err) {
		console.error(err);
		throw new Error("Not Authenticated");
	}

	return next();
};
