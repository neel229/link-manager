import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
/**
 * IContext is the custom context object.
 * It is passed in the graphql request.
 */
export interface IContext {
	req: Request;
	res: Response;
	payload?: string | JwtPayload;
}
