import { sign, verify } from "jsonwebtoken";
import fs from "fs";
import { User } from "../entities/User";

const pk = fs.readFileSync("ec_public.pem");
const sk = fs.readFileSync("ec_private.pem");

// generate an access token
export const signJWT = (user: User, isRefresh?: boolean) => {
	const expiresIn = isRefresh ? "7d" : "15m";
	return sign({ userId: user.id }, sk, {
		expiresIn: expiresIn,
		algorithm: "ES256"
	});
};

// verify access token and return user id
export const verifyJWT = (accessToken: string) => {
	return verify(accessToken, pk, {
		// matching algorithm header will prevent
		// bypassing of signature verification
		algorithms: ["ES256"]
	});
};
